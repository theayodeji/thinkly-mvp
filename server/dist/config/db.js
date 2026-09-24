import mongoose from "mongoose";
import { config } from "./env.js";
export default async function connectDB() {
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(config.MONGO_URL);
        console.log("✅ MongoDB connected");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
