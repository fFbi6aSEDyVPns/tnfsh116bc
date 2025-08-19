const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD || "1234"; // 登入密碼
const COOKIE_NAME = "auth";

// ----------------------
// DB 初始化：Postgres (Render) 或 SQLite (Local)
// ----------------------
let dbType = "sqlite";
let db;

if (process.env.DATABASE_URL) {
  // --- Render / Production: Postgres ---
  const { Pool } = require("pg");
  dbType = "postgres";
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });
  console.log("✅ Using Postgres");

  (async () => {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          start TEXT NOT NULL,
          "end" TEXT
        )
      `);
      console.log("✅ Events table ready in Postgres");
    } catch (err) {
      console.error("❌ Failed to init Postgres:", err);
    }
  })();
} else {
  // --- Local 開發: SQLite ---
  const sqlite3 = require("sqlite3").verbose();
  db = new sqlite3.Database(
    path.join(__dirname, "..", "backend", "events.db"),
    (err) => {
      if (err) {
        console.error("❌ Failed to connect to SQLite DB:", err.message);
      } else {
        console.log("✅ Connected to SQLite database");
      }
    }
  );
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start TEXT NOT NULL,
      end TEXT
    )
  `);
  console.log("✅ Events table ready in SQLite");
}

// ----------------------
// 登入系統
// ----------------------
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login", "index.html"));
});

app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.cookie(COOKIE_NAME, "true", {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: "Wrong password" });
});

app.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

// middleware: 檢查 cookie
function auth(req, res, next) {
  if (req.cookies[COOKIE_NAME] === "true") {
    return next();
  }
  res.redirect("/login");
}

// ----------------------
// 行事曆 API
// ----------------------
app.get("/api/events", auth, async (req, res) => {
  if (dbType === "postgres") {
    try {
      const result = await db.query("SELECT * FROM events ORDER BY id ASC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    db.all("SELECT * FROM events ORDER BY id ASC", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

app.post("/api/events", auth, async (req, res) => {
  const { title, start, end } = req.body;
  if (dbType === "postgres") {
    try {
      const result = await db.query(
        'INSERT INTO events (title, start, "end") VALUES ($1, $2, $3) RETURNING *',
        [title, start, end]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    db.run(
      "INSERT INTO events (title, start, end) VALUES (?, ?, ?)",
      [title, start, end],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, start, end });
      }
    );
  }
});

app.delete("/api/events/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (dbType === "postgres") {
    try {
      await db.query("DELETE FROM events WHERE id = $1", [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    db.run("DELETE FROM events WHERE id = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  }
});

// ----------------------
// 保護頁面 + 靜態檔案
// ----------------------
app.use("/protected", auth, express.static(path.join(__dirname, "protected")));
app.use(express.static(__dirname));

// ----------------------
// 啟動伺服器
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});