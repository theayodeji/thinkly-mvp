import mongoose from "mongoose";
const ChatMessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true } // Index for sorting and pagination
});
export default mongoose.model("ChatMessage", ChatMessageSchema);
