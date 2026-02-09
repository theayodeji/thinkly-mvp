import { Source } from "./source";
import { Flashcard } from "./flashcard";

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
  flashcards?: string[] | Flashcard[]; // Can be array of IDs or populated flashcards
};

export type NotePreview = Pick<Note, "_id" | "title" | "sources" | "createdAt">;