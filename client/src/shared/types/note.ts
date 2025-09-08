export type Note = {
  _id: string;
  title: string;
  content: string;
  sources: string[];
  userId: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  quizzes?: string[];
};

export type NotePreview = Pick<Note, "_id" | "title" | "sources" | "createdAt">;