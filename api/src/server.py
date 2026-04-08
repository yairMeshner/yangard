from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import datetime
import psycopg2
import os
import sys
import shutil
from dotenv import load_dotenv
import json
import uuid
from openai import OpenAI

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

app = FastAPI()

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        sslmode=os.getenv("DB_SSLMODE", "prefer"),
    )


def init_db():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            uuid        VARCHAR(36) PRIMARY KEY,
            name        VARCHAR(255) NOT NULL,
            email       VARCHAR(255) UNIQUE NOT NULL,
            password    VARCHAR(255) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS children (
            id                    SERIAL PRIMARY KEY,
            parent_uuid           VARCHAR(36) NOT NULL REFERENCES users(uuid),
            name                  VARCHAR(255) NOT NULL,
            year_of_birth         INTEGER NOT NULL,
            gender                VARCHAR(50),
            mental_considerations TEXT
        );
        CREATE TABLE IF NOT EXISTS key_events (
            id          SERIAL PRIMARY KEY,
            user_uuid   VARCHAR(36) NOT NULL REFERENCES users(uuid),
            key_events  JSONB NOT NULL,
            created_at  TIMESTAMP DEFAULT NOW()
        );
    """)
    conn.commit()
    cursor.close()
    conn.close()
    print("[DB] tables ready")


init_db()


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


@app.post("/api/register")
def register(body: RegisterRequest):
    try:
        conn = get_conn()
        cursor = conn.cursor()

        cursor.execute("SELECT uuid FROM users WHERE email = %s", (body.email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return {"status": "error", "message": "Email already in use"}

        user_uuid = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO users (uuid, name, email, password) VALUES (%s, %s, %s, %s)",
            (user_uuid, body.name, body.email, body.password)
        )
        conn.commit()
        cursor.close()
        conn.close()
        print(f"[REGISTER] new user: {body.email} → {user_uuid}")
        return {"status": "ok", "uuid": user_uuid, "name": body.name}

    except Exception as e:
        print(f"[DB ERROR] register failed: {e}")
        return {"status": "error", "message": str(e)}


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/api/login")
def login(body: LoginRequest):
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT uuid, name FROM users WHERE email = %s AND password = %s",
            (body.email, body.password)
        )
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        if row is None:
            return {"status": "error", "message": "Invalid email or password"}
        print(f"[LOGIN] {body.email} → {row[0]}")
        return {"status": "ok", "uuid": row[0], "name": row[1]}
    except Exception as e:
        print(f"[DB ERROR] login failed: {e}")
        return {"status": "error", "message": str(e)}


class KeyEvent(BaseModel):
    timestamp: str
    key: str
    app: str


class KeyEventBatch(BaseModel):
    key_events: list[KeyEvent]


@app.post("/api/key_events")
def receive_key_events(batch: KeyEventBatch, x_user_uuid: str = Header()):
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Received {len(batch.key_events)} key event(s) from {x_user_uuid}:")
    for key_event in batch.key_events:
        print(f"  {key_event.timestamp} | {key_event.key:10} | {key_event.app}")

    db_key_events = []
    for key_event in batch.key_events:
        db_key_events.append(key_event.model_dump())

    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO key_events (user_uuid, key_events) VALUES (%s, %s)",
            (x_user_uuid, json.dumps(db_key_events))
        )
        conn.commit()
        cursor.close()
        conn.close()
        print(f"[DB] inserted {len(db_key_events)} key event(s) successfully")
    except Exception as e:
        print(f"[DB ERROR] failed to insert: {e}")
        return {"status": "error", "message": str(e)}

    return {"status": "ok", "received": len(batch.key_events)}


KEY_MAP = {
    'Key.space':    ' ',
    'Key.enter':    '\n',
    'Key.tab':      '\t',
    'Key.backspace': None,
}

SKIP_KEYS = {
    'Key.shift', 'Key.shift_r', 'Key.ctrl_l', 'Key.ctrl_r',
    'Key.alt_l', 'Key.alt_r', 'Key.cmd', 'Key.caps_lock',
    'Key.up', 'Key.down', 'Key.left', 'Key.right',
    'Key.delete', 'Key.home', 'Key.end', 'Key.page_up', 'Key.page_down',
    'Key.f1', 'Key.f2', 'Key.f3', 'Key.f4', 'Key.f5', 'Key.f6',
    'Key.f7', 'Key.f8', 'Key.f9', 'Key.f10', 'Key.f11', 'Key.f12',
    'Key.esc', 'Key.insert', 'Key.print_screen', 'Key.pause',
    'Key.num_lock', 'Key.scroll_lock',
}


def build_text_by_app(flat_events):
    text_by_app = {}
    for event in flat_events:
        app = event["app"]
        key = event["key"]
        if key in SKIP_KEYS:
            continue
        if key in KEY_MAP:
            char = KEY_MAP[key]
            if char is None:
                if app in text_by_app and text_by_app[app]:
                    text_by_app[app].pop()
                continue
        else:
            char = key
        if app not in text_by_app:
            text_by_app[app] = []
        text_by_app[app].append(char)
    return {app: ''.join(chars) for app, chars in text_by_app.items()}


def build_prompt(child, text_by_app):
    from datetime import date
    age = date.today().year - child["year_of_birth"]
    gender = child["gender"] or ""
    possessive = "her" if gender.lower() == "female" else "his"

    child_context = f"""Child Profile:
- Name: {child["name"]}
- Age: {age} years old
- Gender: {gender}
- Mental health considerations: {child["mental_considerations"] or "None reported"}"""

    activity_text = json.dumps(text_by_app, indent=2, ensure_ascii=False)

    response_format = """\
Respond ONLY with a valid JSON object in the following format, with no explanation or text outside the JSON:

{
  "overall_summary": "<A 3-5 sentence clinical summary of the child's overall activity and emotional state for this period. Write in third person using the child's name. Be professional and direct.>",
  "alerts": [
    {
      "id": <number>,
      "severity": "<HIGH | MEDIUM | LOW>",
      "title": "<Short title of the issue, max 8 words>",
      "summary": "<1-2 sentence clinical description of the concern. Do not quote the child directly. Describe the pattern or behavior.>",
      "time": "<HH:MM if available, otherwise omit this field>",
      "sources": ["<app name>"]
    }
  ]
}

Severity definitions:
- HIGH: Immediate risk to the child or others. Includes threats, self-harm, abuse, or grooming.
- MEDIUM: Concerning behavioral patterns requiring parental attention. Includes bullying, repeated inappropriate content, or signs of emotional distress.
- LOW: Mild policy violations or curiosity-driven behavior. Low immediate risk but worth noting.

If no alerts are found, return an empty alerts array."""

    return f"""\
You are a child psychologist and digital safety analyst. Your role is to analyze the digital activity of a child and produce a clinical report for their parent. You must assess the content for signs of bullying, self-harm, threats, emotional distress, inappropriate content, and any other concerning behavioral patterns.

You are analyzing activity for the following child:
{child_context}

Keep the child's age, gender, and mental health profile in mind throughout your analysis. A concern that may be low severity for one child may be high severity for another given {possessive} specific mental health considerations.

Below is the child's typed activity as a JSON object. Each key is the name of an application, and each value is the full text typed by the child in that application during the analysis period:

{activity_text}

{response_format}"""


@app.get("/api/report")
def get_report(from_date: str, to_date: str, x_user_uuid: str = Header()):
    try:
        conn = get_conn()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT name, year_of_birth, gender, mental_considerations FROM children WHERE parent_uuid = %s",
            (x_user_uuid,)
        )
        row = cursor.fetchone()
        if row is None:
            cursor.close()
            conn.close()
            return {"status": "error", "message": "No child found"}
        child = {
            "name": row[0],
            "year_of_birth": row[1],
            "gender": row[2],
            "mental_considerations": row[3],
        }

        cursor.execute(
            "SELECT key_events FROM key_events WHERE user_uuid = %s AND created_at BETWEEN %s AND %s",
            (x_user_uuid, from_date, to_date)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        flat_events = []
        for r in rows:
            for event in r[0]:
                flat_events.append(event)

        text_by_app = build_text_by_app(flat_events)
        prompt = build_prompt(child, text_by_app)

        print(f"\n[REPORT] {len(flat_events)} events across {len(text_by_app)} app(s): {list(text_by_app.keys())}")

        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )

        content = response.choices[0].message.content
        print(f"[LLM RAW] {content[:200]}")
        content = content.strip()
        content = content.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        analysis = json.loads(content)
        print(f"[LLM] received {len(analysis.get('alerts', []))} alert(s)")

        return {
            "status": "ok",
            "child": child,
            "event_count": len(flat_events),
            "overall_summary": analysis["overall_summary"],
            "alerts": analysis["alerts"],
        }

    except Exception as e:
        print(f"[DB ERROR] failed to build report: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/api/child")
def get_child(x_user_uuid: str = Header()):
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT name, year_of_birth, gender, mental_considerations FROM children WHERE parent_uuid = %s",
            (x_user_uuid,)
        )
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        if row is None:
            return {"status": "error", "message": "No child found"}
        return {
            "status": "ok",
            "child": {
                "name": row[0],
                "year_of_birth": row[1],
                "gender": row[2],
                "mental_considerations": row[3],
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


class ChildRequest(BaseModel):
    name: str
    year_of_birth: int
    gender: str
    mental_considerations: str | None = None


@app.post("/api/child")
def create_child(body: ChildRequest, x_user_uuid: str = Header()):
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO children (parent_uuid, name, year_of_birth, gender, mental_considerations) VALUES (%s, %s, %s, %s, %s)",
            (x_user_uuid, body.name, body.year_of_birth, body.gender, body.mental_considerations)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.patch("/api/child")
def update_child(body: ChildRequest, x_user_uuid: str = Header()):
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE children SET name = %s, year_of_birth = %s, gender = %s, mental_considerations = %s WHERE parent_uuid = %s",
            (body.name, body.year_of_birth, body.gender, body.mental_considerations, x_user_uuid)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/api/download")
def download_keyspy(x_user_uuid: str = Header()):
    exe_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "keyspy", "keyspy.exe"))
    if not os.path.exists(exe_path):
        return {"status": "error", "message": "keyspy.exe not found"}
    return FileResponse(
        path=exe_path,
        filename=f"keyspy_{x_user_uuid}.exe",
        media_type="application/octet-stream",
    )


@app.post("/api/keepalive")
def keepalive(x_user_uuid: str = Header()):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] keepalive ping from {x_user_uuid}")
    return {"status": "ok"}
