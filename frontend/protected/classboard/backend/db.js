/* import { MongoClient, ObjectId } from "mongodb";

let client, db, messages;

async function init() {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/classboard";

  try {
    client = new MongoClient(mongoUri);
    await client.connect();

    db = client.db(); // 使用 connection string 裡的 DB 名稱
    messages = db.collection("messages");

    await messages.createIndex({ created_at: -1 });

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

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
  const result = await messages.updateOne(
    { _id: new ObjectId(String(id)) }, // ✅ 確保 id 是字串
    { $set: { content } }
  );
  return { success: result.modifiedCount > 0 };
}

async function deleteMessage(id) {
  const result = await messages.deleteOne({ _id: new ObjectId(String(id)) }); // ✅
  return { success: result.deletedCount > 0 };
}

export { init, getMessages, addMessage, updateMessage, deleteMessage };
*/