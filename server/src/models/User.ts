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
      total: Number,
      completed: Number,
      lastCompletedAt: Date,
    },
  } as any,
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
      });
    } else if (!user.googleId) {
      // Link Google account to existing email
      user.googleId = profile.id;
      await user.save();
    }

    return user;
  },
);

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
