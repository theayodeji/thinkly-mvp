import { api } from "./api";
import { User } from "../types/auth";
import { UserSchema } from "../schemas";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
}

export const authService = {
  getMe: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return UserSchema.parse(response.data) as User;
  },

  register: async (credentials: RegisterCredentials): Promise<{ user: User }> => {
    const response = await api.post("/auth/register", credentials);
    return { user: UserSchema.parse(response.data.user) as User };
  },

  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    const response = await api.post("/auth/login", credentials);
    return { user: UserSchema.parse(response.data.user) as User };
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
