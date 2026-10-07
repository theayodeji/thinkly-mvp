import mongoose, { Schema, Document } from "mongoose";

export interface IUserBillingSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  provider: "paystack" | "stripe";
  providerSubscriptionId: string;
  providerCustomerId: string;
  planId: string;
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

const userBillingSubscriptionSchema = new Schema<IUserBillingSubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  provider: { type: String, required: true },
  providerSubscriptionId: { type: String, required: true, unique: true },
  providerCustomerId: { type: String, required: true },
  planId: { type: String, required: true },
  status: { type: String, required: true },
  currentPeriodEnd: { type: Date, required: true },
  cancelAtPeriodEnd: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IUserBillingSubscription>("UserBillingSubscription", userBillingSubscriptionSchema);
