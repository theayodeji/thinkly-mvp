export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    streaks: {
        current: number;
        longest: number;
        lastActive: Date;
    };
    achievements: {
        id: string; // unique identifier, e.g. "first_quiz_completed"
        title: string;
        description: string;
        icon: string;
        earnedAt: Date;
    }[];

    badges: {
        id: string; // e.g. "gold_streak_badge"
        title: string;
        level: string; // bronze, silver, gold, platinum
        earnedAt: Date;
    }[];
    preferences?: {
        theme: "light" | "dark" | "system";
        defaultVoice: string;
        quizDifficulty: "beginner" | "intermediate" | "advanced";
        emailReminders: boolean;
    };
  }
  
  export interface AuthContextType {
    user: User | null;
    isLoggingIn: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, name: string, otp: string) => Promise<void>;
  }
  