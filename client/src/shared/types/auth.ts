export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    isLoggingIn: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
  }
  