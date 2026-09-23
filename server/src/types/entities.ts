// src/types/User.ts
import { Document, Types } from "mongoose";

export interface IUser extends Document<Types.ObjectId> {
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  googleId?: string; // Google OAuth ID
  streaks: {
    current: number;
    longest: number;
    lastActive: Date;
  };
  achievements: [
    {
      id: string; // unique identifier, e.g. "first_quiz_completed"
      title: string;
      description: string;
      icon: string;
      earnedAt: Date;
    },
  ];

  badges: [
    {
      id: string; // e.g. "gold_streak_badge"
      title: string;
      level: string; // bronze, silver, gold, platinum
      earnedAt: Date;
    },
  ];
  pomodoros: {
    total: number;
    completed: number;
    lastCompletedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface INote extends Document<Types.ObjectId> {
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

export enum SourceType {
  TEXT = "text",
  FILE_PDF = "file_pdf",
  LINK = "link",
}

export interface ISource extends Document<Types.ObjectId> {
  type: SourceType;
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
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
}

export interface IQuiz extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  noteId: Types.ObjectId;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashcard extends Document<Types.ObjectId> {
  question: string;
  answer: string;
  noteId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
