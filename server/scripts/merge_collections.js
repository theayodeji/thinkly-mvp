import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "server/.env" });
async function run() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected");
  try {
    const db = mongoose.connection.db;
    const notes = await db.collection("notes").find().toArray();
    if (notes.length > 0) {
      await db.collection("spaces").insertMany(notes);
      await db.collection("notes").drop();
      console.log("Merged notes into spaces and dropped notes");
    } else {
      console.log("No notes to merge");
    }
  } catch (e) {
    console.error("Error merging:", e.message);
  }
  process.exit(0);
}
run();
