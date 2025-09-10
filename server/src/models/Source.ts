import mongoose from "mongoose";
import type { ISource } from "../types/entities.js";

const SourceSchema = new mongoose.Schema<ISource>(
  {
    type: { type: String, required: true },
    name: { type: String },
    file_url: { type: String },
    text: { type: String },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
    status: { type: String, enum: ["parsing", "parsed", "error"], default: "parsing" },
  },
  { timestamps: true }
);

export default mongoose.model("Source", SourceSchema);