// src/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import type { IUser } from "@thinkly/shared";

// Extend the IUser interface to include the static method
export interface IUserModel extends Model<IUser> {
  findOrCreate(profile: {
    id: string;
    displayName: string;
    emails: Array<{ value: string; verified?: boolean }>;
  }): Promise<IUser & Document>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: {
      type: String,
      required: function () {
        return !(this as any).googleId; // Password is only required for non-Google users
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for non-Google users
    },
    streaks: {
      current: Number,
      longest: Number,
      lastActive: Date,
    },
    badges: [
      {
        id: String, // e.g. "gold_streak_badge"
        title: String,
        level: String, // bronze, silver, gold, platinum
        earnedAt: Date,
      },
    ],
    pomodoros: {
      total: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      lastCompletedAt: Date,
    },
    preferences: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      defaultVoice: { type: String, default: "hip" },
      quizDifficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "intermediate" },
      emailReminders: { type: Boolean, default: true },
    },
    subscription_tier: { type: String, enum: ["guest", "free", "premium"], default: "free" },
    subscription_status: { type: String, enum: ["active", "past_due", "canceled"], default: "active" },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  {
    timestamps: true,
  },
);

// Add static method for findOrCreate
userSchema.static(
  "findOrCreate",
  async function (profile: {
    id: string;
    displayName: string;
    emails: Array<{ value: string; verified?: boolean }>;
  }) {
    let user = await this.findOne({
      $or: [{ email: profile.emails[0].value }, { googleId: profile.id }],
    });

    if (!user) {
      user = await this.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isEmailVerified: true,
      });
    } else {
      let needsSave = false;
      if (!user.googleId) {
        user.googleId = profile.id;
        needsSave = true;
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    }

    return user;
  },
);

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
