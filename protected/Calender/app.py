import os
import sqlite3
import psycopg2
import psycopg2.extras
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from pathlib import Path

app = Flask(__name__)
CORS(app)

# ------------------ DB 切換 ------------------
USE_SQLITE = os.getenv("DATABASE_URL") is None
if USE_SQLITE:
    DB_PATH = Path(__file__).parent / "events.db"

def get_db():
    if USE_SQLITE:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    else:
        return psycopg2.connect(os.environ["DATABASE_URL"], sslmode="require")

# ------------------ 初始化資料表 ------------------
def init_db():
    conn = get_db()
    cur = conn.cursor()

    if USE_SQLITE:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                time TEXT,
                text TEXT NOT NULL,
                all_day INTEGER NOT NULL CHECK(all_day IN (0,1))
            )
        """)
    else:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                date DATE NOT NULL,
                time TEXT,
                text TEXT NOT NULL,
                all_day BOOLEAN DEFAULT FALSE
            )
        """)
    conn.commit()
    cur.close()
    conn.close()

# ------------------ API ------------------
@app.get("/api/events")
def get_events():
    date = request.args.get("date")
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except:
        return jsonify({"error": "Invalid or missing date (YYYY-MM-DD)"}), 400

    conn = get_db()
    if USE_SQLITE:
        cur = conn.execute("""
            SELECT id, date, time, text, all_day
            FROM events
            WHERE date = ?
            ORDER BY all_day DESC,
                     CASE WHEN time IS NULL THEN 0 ELSE 1 END,
                     time ASC,
                     id ASC
        """, (date,))
        rows = cur.fetchall()
    else:
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("""
            SELECT id, date, time, text, all_day
            FROM events
            WHERE date = %s
            ORDER BY all_day DESC,
                     CASE WHEN time IS NULL THEN 0 ELSE 1 END,
                     time ASC,
                     id ASC
        """, (date,))
        rows = cur.fetchall()
    conn.close()

    data = [dict(r) for r in rows]
    for d in data:
        d["all_day"] = bool(d["all_day"])
    return jsonify({"date": date, "events": data})

@app.post("/api/events")
def add_event():
    payload = request.get_json(silent=True) or {}
    date = payload.get("date")
    text = (payload.get("text") or "").strip()
    time = payload.get("time")
    all_day = bool(payload.get("all_day", False))

    try:
        datetime.strptime(date, "%Y-%m-%d")
    except:
        return jsonify({"error": "Invalid or missing date (YYYY-MM-DD)"}), 400
    if not text:
        return jsonify({"error": "Missing event text"}), 400
    if all_day:
        time = None
    else:
        if not time:
            return jsonify({"error": "Missing time for non-all-day event"}), 400
        try:
            datetime.strptime(time, "%H:%M")
        except:
            return jsonify({"error": "Invalid time (HH:MM)"})

    conn = get_db()
    if USE_SQLITE:
        cur = conn.execute(
            "INSERT INTO events (date, time, text, all_day) VALUES (?, ?, ?, ?)",
            (date, time, text, int(all_day))
        )
        new_id = cur.lastrowid
        row = conn.execute("SELECT * FROM events WHERE id = ?", (new_id,)).fetchone()
        conn.commit()
    else:
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(
            "INSERT INTO events (date, time, text, all_day) VALUES (%s, %s, %s, %s) RETURNING *",
            (date, time, text, all_day)
        )
        row = cur.fetchone()
        conn.commit()
    conn.close()

    data = dict(row)
    data["all_day"] = bool(data["all_day"])
    return jsonify(data), 201

@app.delete("/api/events/<int:event_id>")
def delete_event(event_id):
    conn = get_db()
    if USE_SQLITE:
        cur = conn.execute("DELETE FROM events WHERE id = ?", (event_id,))
        deleted = cur.rowcount
        conn.commit()
    else:
        cur = conn.cursor()
        cur.execute("DELETE FROM events WHERE id = %s", (event_id,))
        deleted = cur.rowcount
        conn.commit()
    conn.close()
    if deleted == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"ok": True})

@app.get("/api/event-dates")
def event_dates():
    start = request.args.get("start")
    end = request.args.get("end")
    try:
        datetime.strptime(start, "%Y-%m-%d")
        datetime.strptime(end, "%Y-%m-%d")
    except:
        return jsonify({"error": "Invalid or missing start/end"}), 400

    conn = get_db()
    if USE_SQLITE:
        rows = conn.execute(
            "SELECT DISTINCT date FROM events WHERE date BETWEEN ? AND ? ORDER BY date ASC",
            (start, end)
        ).fetchall()
        dates = [r["date"] for r in rows]
    else:
        cur = conn.cursor()
        cur.execute(
            "SELECT DISTINCT date FROM events WHERE date BETWEEN %s AND %s ORDER BY date ASC",
            (start, end)
        , (start, end))
        dates = [r[0].strftime("%Y-%m-%d") for r in cur.fetchall()]
    conn.close()
    return jsonify({"dates": dates})

# ------------------ 啟動 ------------------
if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)