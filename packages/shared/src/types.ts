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
  preferences: {
    theme: "light" | "dark" | "system";
    defaultVoice: string;
    quizDifficulty: "beginner" | "intermediate" | "advanced";
    emailReminders: boolean;
  };
  plan?: "free" | "pro";
  dailyAIActionsCount?: number;
  lastAIActionDate?: Date;
  dailyAudioActionsCount?: number;
  lastAudioActionDate?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpace {
  _id: string;
  title: string;
  content: string;
  userId: string;
  summary: string;
  sourcesCount?: number;
  isGuest?: boolean;
  expiresAt?: Date;
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
  spaceId: string;
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
  spaceId: string;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashcard {
  _id: string;
  question: string;
  answer: string;
  spaceId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id?: string;
  chatId: string;
  spaceId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IChat {
  _id: string;
  spaceId: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginatedChatHistory {
  history: IMessage[];
  hasMore: boolean;
  nextCursor?: string;
}
export interface IAudioExplainer {
  _id: string;
  spaceId: string;
  userId: string;
  concept: string;
  script: string;
  audioUrl: string;
  voiceId: string;
  duration?: number;
  status: "processing" | "ready" | "error";
  createdAt: Date;
  updatedAt: Date;
}



export interface ILearningPathNode {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topicsCovered: string[];
}

export interface ILearningPath {
  _id: string;
  spaceId: string;
  userId: string;
  topic: string;
  nodes: ILearningPathNode[];
  createdAt: Date;
  updatedAt: Date;
}

export enum OTPType {
  EMAIL_VERIFICATION = "email_verification",
  PASSWORD_RESET = "password_reset",
  SECURITY_ACTION = "security_action",
}

export interface IOTPRecord {
  _id?: string;
  email: string;
  code: string;
  type: OTPType;
  attempts: number;
  expiresAt: Date;
  createdAt?: Date;
}

