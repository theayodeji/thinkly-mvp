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
    achievements: [{
        id: String, // unique identifier, e.g. "first_quiz_completed"
        title: String,
        description: String,
        icon: String,
        earnedAt: Date,
      }],

      badges: [{
        id: String, // e.g. "gold_streak_badge"
        title: String,
        level: String, // bronze, silver, gold, platinum
        earnedAt: Date,
      }],
  }
  
  export interface AuthContextType {
    user: User | null;
    isLoggingIn: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
  }
  