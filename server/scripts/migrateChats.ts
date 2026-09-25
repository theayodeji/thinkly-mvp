import mongoose from "mongoose";
import dotenv from "dotenv";
import ChatModel from "../src/models/Chat.js";
import ChatMessageModel from "../src/models/ChatMessage.js";

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGO_URL as string);
  console.log("Connected to MongoDB");

  // Use raw collection to access the dropped 'messages' array
  const chats = await mongoose.connection.collection("chats").find({}).toArray();
  let count = 0;

  for (const chat of chats) {
    if (chat.messages && chat.messages.length > 0) {
      const messagesToInsert = chat.messages.map((msg: any) => ({
        chatId: chat._id,
        spaceId: chat.spaceId,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt || chat.createdAt
      }));
      
      await ChatMessageModel.insertMany(messagesToInsert);
      
      // Remove messages from chat document
      await mongoose.connection.collection("chats").updateOne(
        { _id: chat._id },
        { $unset: { messages: 1 } }
      );
      
      count += messagesToInsert.length;
    }
  }

  console.log(`Migrated ${count} messages successfully.`);
  process.exit(0);
}

migrate().catch(console.error);
