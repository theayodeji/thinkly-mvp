import mongoose from "mongoose";
import type { IQuiz, IQuizQuestion } from "@thinkly/shared";

const QuizSchema = new mongoose.Schema<IQuiz>(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    spaceId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Space", 
      required: true 
    },
    questions: [{
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true },
      explanation: { type: String, required: true }
    }]
  } as any,
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
