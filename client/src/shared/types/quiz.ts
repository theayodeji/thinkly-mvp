export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  _id: string;
  userId: string;
  noteId: string;
  questions: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}
