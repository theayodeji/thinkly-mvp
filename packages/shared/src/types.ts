export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  streaks: {
    current: number;
    longest: number;
    lastActive: Date;
  };
  achievements: [
    {
      id: string;
      title: string;
      description: string;
      icon: string;
      earnedAt: Date;
    }
  ];
  badges: [
    {
      id: string;
      title: string;
      level: string;
      earnedAt: Date;
    }
  ];
  pomodoros: {
    total: number;
    completed: number;
    lastCompletedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  sources: string[];
  userId: string;
  summary: string;
  quiz?: string;
  chatSuggestions?: string[];
  flashcards: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum SourceType {
  TEXT = "text",
  FILE_PDF = "file_pdf",
  LINK = "link",
}

export interface ISource {
  _id: string;
  type: SourceType;
  name?: string;
  file_url?: string;
  text?: string;
  noteId: string;
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

export interface IQuiz {
  _id: string;
  userId: string;
  noteId: string;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashcard {
  _id: string;
  question: string;
  answer: string;
  noteId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
