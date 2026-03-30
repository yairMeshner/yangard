# api — Understanding Questions

1. What is FastAPI and why did we choose it over other frameworks?
2. What does `BaseModel` from pydantic do, and why is it useful?
3. What happens if the client sends a request with a missing field, like no `app` in a key event?
4. Why does `receive_events` return `{"status": "ok", "received": len(batch.events)}` instead of just `{"status": "ok"}`?
5. What is the difference between `GET` and `POST` — why do we use `POST` here?
6. What does the `/docs` endpoint give you, and how does FastAPI generate it automatically?
7. Why does `keepalive` not need a request body?
8. If two clients send events at the same time, what happens on the server?
9. What would you need to change in the server to support multiple clients (e.g. different users)?
10. What is the purpose of `received_at` in the database table?
