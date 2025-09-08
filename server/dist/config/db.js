import mongoose from "mongoose";
export default async function connectDB() {
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB connected");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map