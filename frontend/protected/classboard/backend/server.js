import express from "express";
import cors from "cors";
import {
  getMessages,
  addMessage,
  updateMessage,
  deleteMessage,
} from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// Get all messages
// -----------------------------
app.get("/messages", async (req, res) => {
  try {
    const rows = await getMessages();
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
    return res
      .status(400)
      .json({ success: false, error: "Name and content required" });
  }

  try {
    const result = await addMessage(name, content);
    res.json({ success: true, data: result });
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
    const result = await deleteMessage(id);
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
    const result = await updateMessage(id, content);
    if (result.success) {
      res.json({ success: true, data: { id, content } });
    } else {
      res.status(404).json({ success: false, error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));