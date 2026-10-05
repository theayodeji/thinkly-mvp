import mongoose from "mongoose";
import type { ILearningPath } from "@thinkly/shared";

const LearningPathNodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    topicsCovered: [{ type: String }],
  },
  { _id: false }
);

const LearningPathSchema = new mongoose.Schema<ILearningPath>(
  {
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Space", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    nodes: [LearningPathNodeSchema],
  } as any,
  { timestamps: true }
);

export default mongoose.model("LearningPath", LearningPathSchema);
