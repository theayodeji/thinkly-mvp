import { Source } from "./source";

export type Note = {
  _id: string;
  title: string;
  content: string;
  sources: Source[];
  userId: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  quiz?: string;
  chatSuggestions?: string[];
};

export type NotePreview = Pick<Note, "_id" | "title" | "sources" | "createdAt">;