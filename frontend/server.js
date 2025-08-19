const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD || "1234"; // 方便測試，沒設定環境變數就用 1234
const COOKIE_NAME = "auth";

// ----------------------
// SQLite 初始化
// ----------------------
const db = new sqlite3.Database(
  path.join(__dirname, "..", "backend", "events.db"),
  (err) => {
    if (err) {
      console.error("❌ Failed to connect to SQLite DB:", err.message);
    } else {
      console.log("✅ Connected to SQLite database");
    }
  }
);

// 建立資料表（若不存在）
db.run(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start TEXT NOT NULL,
    end TEXT
  )
`);

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
// 行事曆 API (受保護)
// ----------------------
app.get("/api/events", auth, (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post("/api/events", auth, (req, res) => {
  const { title, start, end } = req.body;
  db.run(
    "INSERT INTO events (title, start, end) VALUES (?, ?, ?)",
    [title, start, end],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, title, start, end });
    }
  );
});

// 刪除活動
app.delete("/api/events/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM events WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});


// ----------------------
// 保護頁面 + 靜態檔案
// ----------------------
// 受保護區（行事曆等）
app.use("/protected", auth, express.static(path.join(__dirname, "protected")));

// 公開靜態頁面
app.use(express.static(__dirname));

// ----------------------
// 啟動伺服器
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});