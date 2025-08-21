import express from "express";
import cors from "cors";
import {
  init,
  getMessages,
  addMessage,
  updateMessage,
  deleteMessage,
} from "./db.js";

const app = express();
app.use(cors({
  origin: "https://tnfsh116bc.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

// -----------------------------
// Health check route
// -----------------------------
app.get("/health", (req, res) => {
  if (!global.dbConnected) {
    return res.status(500).json({ status: "error", message: "DB not connected" });
  }
  res.json({ status: "ok" });
});

// -----------------------------
// Routes
// -----------------------------
app.get("/messages", async (req, res) => {
  try {
    const rows = await getMessages();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/messages", async (req, res) => {
  const { name, content } = req.body;
  if (!name || !content) {
    return res.status(400).json({ success: false, error: "Name and content required" });
  }

  try {
    const result = await addMessage(name, content);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/messages/:id", async (req, res) => {
  try {
    const result = await deleteMessage(req.params.id);
    if (result.success) {
      res.json({ success: true, message: `Message ${req.params.id} deleted` });
    } else {
      res.status(404).json({ success: false, error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/messages/:id", async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, error: "Content required" });
  }

  try {
    const result = await updateMessage(req.params.id, content);
    if (result.success) {
      res.json({ success: true, data: { id: req.params.id, content } });
    } else {
      res.status(404).json({ success: false, error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------
// Start server after DB init
// -----------------------------
const PORT = process.env.PORT || 3000;

init()
  .then(() => {
    global.dbConnected = true;
    app.listen(PORT, () => console.log(`🚀 Mongo Server running on port ${PORT}`));
  })
  .catch((err) => {
    global.dbConnected = false;
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });
