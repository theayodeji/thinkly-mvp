import mongoose from "mongoose";
const SpaceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    summary: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
export default mongoose.model("Space", SpaceSchema);
