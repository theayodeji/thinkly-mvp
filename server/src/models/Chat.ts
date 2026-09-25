import mongoose from "mongoose";
import type { IChat } from "@thinkly/shared";

const ChatSchema = new mongoose.Schema<IChat>(
  {
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String }
  } as any,
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
