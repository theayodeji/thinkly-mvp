import mongoose, { Schema, Document } from "mongoose";
import { OTPType } from "@thinkly/shared";

export interface IOTPDocument extends Document {
  email: string;
  code: string;
  type: OTPType;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOTPDocument>(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    code: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(OTPType),
      required: true,
    },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// MongoDB TTL index: automatically deletes document when expiresAt timestamp is reached
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPModel = mongoose.model<IOTPDocument>("OTP", otpSchema);

export default OTPModel;
