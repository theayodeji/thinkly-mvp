// src/types/User.ts
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;  // Optional for OAuth users
  googleId?: string;  // Google OAuth ID
  streaks: {
    current: number;
    longest: number;
    lastActive: Date;
  };
  achievements: [{
    id: String, // unique identifier, e.g. "first_quiz_completed"
    title: String,
    description: String,
    icon: String,
    earnedAt: Date,
  }],

  badges: [{
    id: String, // e.g. "gold_streak_badge"
    title: String,
    level: String, // bronze, silver, gold, platinum
    earnedAt: Date,
  }],
  createdAt: Date;
  updatedAt: Date;
}

export interface INote extends Document {
  title: string;
  content: string;
  sources: Types.ObjectId[];
  userId: Types.ObjectId;
  summary: string;
  quiz?: Types.ObjectId;
  chatSuggestions?: string[];
  flashcards: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISource extends Document {
  type: "pdf" | "url" | "text" | "image";
  name?: string;
  file_url?: string;
  text?: string;
  noteId: Types.ObjectId;
  status: "parsing" | "parsed" | "error";
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface IQuiz extends Document {
  userId: Types.ObjectId;
  noteId: Types.ObjectId;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashcard extends Document {
  question: string;
  answer: string;
  noteId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  type: "login_streak_incremented" | "quiz_completed" | "quiz_perfect_score" | "note_added" | "question_asked" | "study_session_completed";
  userId: Types.ObjectId;
  metadata?: Record<string, any>;
}

export interface IEvent extends Document, Event {
  createdAt: Date;
}