import { MongoClient } from "mongodb";

let client, db, messages;

// Connect to MongoDB
async function init() {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/classboard";

  try {
    client = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    db = client.db(); // default DB (from connection string)
    messages = db.collection("messages");

    // Ensure index on created_at for sorting
    await messages.createIndex({ created_at: -1 });

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// Wrapper query functions (similar to your old API)
async function getMessages() {
  return await messages.find().sort({ created_at: -1 }).toArray();
}

async function addMessage(name, content) {
  const result = await messages.insertOne({
    name,
    content,
    created_at: new Date(),
  });
  return { success: result.acknowledged, id: result.insertedId };
}

async function updateMessage(id, content) {
  const { ObjectId } = await import("mongodb");
  const result = await messages.updateOne(
    { _id: new ObjectId(id) },
    { $set: { content } }
  );
  return { success: result.modifiedCount > 0 };
}

async function deleteMessage(id) {
  const { ObjectId } = await import("mongodb");
  const result = await messages.deleteOne({ _id: new ObjectId(id) });
  return { success: result.deletedCount > 0 };
}

// Run init immediately
await init();

export { getMessages, addMessage, updateMessage, deleteMessage };