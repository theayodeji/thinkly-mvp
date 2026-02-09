export type Flashcard = {
  _id: string;
  question: string;
  answer: string;
  noteId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type FlashcardInput = {
  question: string;
  answer: string;
  noteId: string;
};
