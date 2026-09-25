import mongoose from "mongoose";
import type { IMessage } from "@thinkly/shared";

const ChatMessageSchema = new mongoose.Schema<IMessage>(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true } // Index for sorting and pagination
  } as any
);

export default mongoose.model("ChatMessage", ChatMessageSchema);
