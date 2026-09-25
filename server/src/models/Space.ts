import mongoose from "mongoose";
import type { ISpace } from "@thinkly/shared";

const SpaceSchema = new mongoose.Schema<ISpace>(
  {
    title: { type: String, required: true },  
    content: { type: String },
    summary: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  } as any,
  { timestamps: true }
);

export default mongoose.model("Space", SpaceSchema);
