import bcrypt from "bcryptjs";
import UserModel from "../../../models/User.js";
import { generateToken } from "../../../utils/jwt.js";
import { StreakService } from "../user/streaks.js";
import { AppError } from "../../../utils/AppError.js";

export const registerUser = async (data: any) => {
  const { name, email, password } = data;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new UserModel({ name, email, password: hashedPassword });
  const updatedUser = await StreakService.handleUpdateStreak(user, true);
  await updatedUser.save();

  const accessToken = generateToken(user._id);
  const refreshToken = generateToken(user._id, true);

  return {
    user: updatedUser,
    accessToken,
    refreshToken
  };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;
  const user = await UserModel.findOne({ email });
  
  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  if (user.googleId && !user.password) {
    throw new AppError("Please sign in with Google", 400);
  }

  if (!user.password) {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const accessToken = generateToken(user._id);
  const refreshToken = generateToken(user._id, true);

  const updatedUser = await StreakService.handleUpdateStreak(user, true);
  await updatedUser.save();

  return {
    user: updatedUser,
    accessToken,
    refreshToken
  };
};

import crypto from "crypto";
import { emailService } from "../../email/EmailService.js";

export const requestPasswordReset = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    // Return success to prevent email enumeration
    return { message: "If an account exists, a reset link was sent" };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(token, 10);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  await emailService.sendPasswordReset(email, token);

  return { message: "If an account exists, a reset link was sent" };
};

export const confirmPasswordReset = async (token: string, newPassword: string) => {
  const users = await UserModel.find({
    resetPasswordExpires: { $gt: new Date() }
  });

  let targetUser = null;
  for (const user of users) {
    if (user.resetPasswordToken && await bcrypt.compare(token, user.resetPasswordToken)) {
      targetUser = user;
      break;
    }
  }

  if (!targetUser) {
    throw new AppError("Invalid or expired password reset token", 400);
  }

  const salt = await bcrypt.genSalt(10);
  targetUser.password = await bcrypt.hash(newPassword, salt);
  
  targetUser.resetPasswordToken = undefined;
  targetUser.resetPasswordExpires = undefined;
  
  await targetUser.save();
  return { message: "Password has been successfully reset" };
};

