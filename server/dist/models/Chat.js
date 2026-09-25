import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema({
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String }
}, { timestamps: true });
export default mongoose.model("Chat", ChatSchema);
