import mongoose, { Schema, Document } from "mongoose";
import { IAudioExplainer } from "@thinkly/shared";

const audioExplainerSchema = new Schema(
  {
    spaceId: { type: Schema.Types.ObjectId, ref: "Space", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    concept: { type: String, required: true },
    script: { type: String, required: true },
    audioUrl: { type: String, required: true },
    voiceId: { type: String, required: true },
    duration: { type: Number },
    status: {
      type: String,
      enum: ["processing", "ready", "error"],
      default: "ready",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAudioExplainer & Document>("AudioExplainer", audioExplainerSchema);
