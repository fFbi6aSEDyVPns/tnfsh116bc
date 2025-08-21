import express from "express";
import cors from "cors";
import { query } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// Get all messages
// -----------------------------
app.get("/messages", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM messages ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------
// Post a new message
// -----------------------------
app.post("/messages", async (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ success: false, error: "Name and content required" });
  }

  try {
    const result = await query(
      "INSERT INTO messages (name, content) VALUES (?, ?) RETURNING id, name, content, created_at",
      [name, content]
    );

    if (Array.isArray(result) && result.length > 0) {
      res.json({ success: true, data: result[0] });
    } else {
      const rows = await query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 1");
      res.json({ success: true, data: rows[0] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------
// Delete a message
// -----------------------------
app.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("DELETE FROM messages WHERE id = ?", [id]);
    if (result.success) {
      res.json({ success: true, message: `Message ${id} deleted` });
    } else {
      res.status(404).json({ success: false, error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------
// Edit a message
// -----------------------------
app.put("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, error: "Content required" });
  }

  try {
    const result = await query(
      "UPDATE messages SET content = ? WHERE id = ?",
      [content, id]
    );

    if (result.success) {
      const rows = await query("SELECT * FROM messages WHERE id = ?", [id]);
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));