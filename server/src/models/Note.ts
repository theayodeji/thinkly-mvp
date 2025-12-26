import mongoose from "mongoose";
import type { INote, IQuizQuestion } from "../types/entities.js";

const QuizQuestionSchema = new mongoose.Schema<IQuizQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
  questions: [QuizQuestionSchema],
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const NoteSchema = new mongoose.Schema<INote>(
  {
    title: { type: String, required: true },  
    sources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Source" }],
    content: { type: String },
    summary: { type: String },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    flashcards: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flashcard'
    }],
    chatSuggestions: [{ type: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);
