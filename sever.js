const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const PASSWORD =process.env.PASSWORD;  // shared password
const COOKIE_NAME = "auth";

// Serve login page publicly
app.use("/login", express.static("login"));

// Handle login
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.cookie(COOKIE_NAME, "true", {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: "Wrong password" });
});

// 🔑 Handle logout (clear cookie)
app.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

// Middleware to protect
function auth(req, res, next) {
  if (req.cookies[COOKIE_NAME] === "true") {
    return next();
  }
  res.redirect("/login");
}

// Serve protected content
app.use("/protected", auth, express.static("protected"));

// Default protected page
app.get("/", auth, (req, res) => {
  res.redirect("/protected/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});