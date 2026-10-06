import mongoose, { Schema, Document } from "mongoose";

export interface IGuestSession extends Document {
  deviceId: string;
  spacesCount: number;
  messagesCount: number;
  learningPathsCount: number;
  flashcardsCount: number;
  createdAt: Date;
}

const guestSessionSchema = new Schema<IGuestSession>(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    spacesCount: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    learningPathsCount: { type: Number, default: 0 },
    flashcardsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, expires: 86400 }, // 24 hours TTL auto-delete
  },
  { timestamps: true }
);

const GuestSession = mongoose.model<IGuestSession>("GuestSession", guestSessionSchema);

export default GuestSession;
