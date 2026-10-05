import { api } from "./api";
import { User } from "../types/auth";
import { UserSchema } from "../schemas";
import { OTPType } from "@thinkly/shared";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  otp: string;
}

export const authService = {
  getMe: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return UserSchema.parse(response.data) as User;
  },

  sendOTP: async (email: string, type: OTPType): Promise<{ message: string }> => {
    const response = await api.post("/auth/send-otp", { email, type });
    return response.data;
  },

  verifyOTP: async (email: string, otp: string, type: OTPType): Promise<{ message: string }> => {
    const response = await api.post("/auth/verify-otp", { email, otp, type });
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<{ user: User }> => {
    const response = await api.post("/auth/register", credentials);
    return { user: UserSchema.parse(response.data.user) as User };
  },

  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    const response = await api.post("/auth/login", credentials);
    return { user: UserSchema.parse(response.data.user) as User };
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }): Promise<{ message: string }> => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  changePassword: async (data: { currentPassword?: string; newPassword: string; otp?: string }): Promise<{ message: string }> => {
    const response = await api.post("/auth/change-password", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
