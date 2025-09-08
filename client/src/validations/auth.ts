// validations/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().refine(
    (value) => value !== "",
    { message: "Email is required" }
  ).refine(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s]{2,}$/.test(value),
    { message: "Invalid email" }
  ),
  password: z.string().min(3, "Enter a valid password"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
