import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.string().transform(Number).default(5000),
    BASE_URL: z.string().default("http://localhost:3000"),
    FRONTEND_URL: z.string().default("http://localhost:5173"),
    MONGO_URL: z.string(),
    JWT_SECRET: z.string().default("your-secret-key"),
    REFRESH_SECRET: z.string().default("refresh-secret-key"),
    GEMINI_API_KEY: z.string(),
    COOKIE_DOMAIN: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CALLBACK_URL: z.string().default("/auth/google/callback"),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables");
}
export const config = _env.data;
