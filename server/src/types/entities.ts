// src/types/User.ts
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;  // Optional for OAuth users
  googleId?: string;  // Google OAuth ID
  createdAt: Date;
  updatedAt: Date;
}

export interface INote extends Document {
  title: string;
  content: string;
  sources: Types.ObjectId[];
  userId: Types.ObjectId;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  quizzes?: Types.ObjectId[];
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
