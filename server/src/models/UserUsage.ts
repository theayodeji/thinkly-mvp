import mongoose, { Schema, Document } from "mongoose";

export interface IUserUsage extends Document {
  userId: mongoose.Types.ObjectId;
  feature: string;
  consumedAmount: number;
  windowStart: Date;
}

const userUsageSchema = new Schema<IUserUsage>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  feature: { type: String, required: true },
  consumedAmount: { type: Number, default: 0 },
  windowStart: { type: Date, default: Date.now },
});

userUsageSchema.index({ userId: 1, feature: 1 }, { unique: true });

export default mongoose.model<IUserUsage>("UserUsage", userUsageSchema);
