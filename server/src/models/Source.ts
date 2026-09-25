import mongoose from "mongoose";
import type { ISource } from "@thinkly/shared";

const SourceSchema = new mongoose.Schema<ISource>(
  {
    type: { type: String, required: true },
    name: { type: String },
    file_url: { type: String },
    text: { type: String },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    status: { type: String, enum: ["parsing", "parsed", "error"], default: "parsing" },
  } as any,
  { timestamps: true }
);

export default mongoose.model("Source", SourceSchema);
