import bcrypt from "bcryptjs";
import UserModel from "../../../models/User.js";
import { generateToken } from "../../../utils/jwt.js";
import { StreakService } from "../user/streaks.js";
import { AppError } from "../../../utils/AppError.js";
import { OTPService } from "../otp/OTPService.js";
import { OTPType } from "@thinkly/shared";

import crypto from "crypto";
import { emailService } from "../../email/EmailService.js";

export const sendOTP = async (email: string, type: OTPType) => {
  // If sending password reset OTP, check if user exists first
  if (type === OTPType.PASSWORD_RESET) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Return success to prevent email enumeration
      return { message: "If an account exists, a verification link was sent" };
    }
  }

  // If sending registration OTP, check if email is already taken
  if (type === OTPType.EMAIL_VERIFICATION) {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError("An account with this email already exists", 400);
    }
  }

  await OTPService.generateAndSendOTP(email, type);
  return { message: "Verification code sent to your email" };
};

export const verifyOTP = async (email: string, otp: string, type: OTPType) => {
  await OTPService.verifyOTP(email, otp, type);
  return { message: "Verification code verified successfully" };
};

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate Email Verification Token (24 hours expiry)
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
    subscription_tier: "free",
    subscription_status: "active",
    isEmailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
  });

  const updatedUser = await StreakService.handleUpdateStreak(user, true);
  await updatedUser.save();

  // Send verification email in background
  emailService.sendEmailVerification(email, verificationToken, name).catch((err) => {
    console.error("Error sending verification email on register:", err);
  });

  const accessToken = generateToken(user._id);
  const refreshToken = generateToken(user._id, true);

  return {
    user: updatedUser,
    accessToken,
    refreshToken,
  };
};

export const resendEmailVerification = async (identifier: { userId?: string; email?: string }) => {
  let user = null;
  if (identifier.userId) {
    user = await UserModel.findById(identifier.userId);
  } else if (identifier.email) {
    user = await UserModel.findOne({ email: identifier.email });
  }

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isEmailVerified) {
    return { message: "Email is already verified" };
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = verificationExpires;
  await user.save();

  await emailService.sendEmailVerification(user.email, verificationToken, user.name);
  return { message: "Verification email sent successfully" };
};

export const verifyEmailWithToken = async (token: string) => {
  if (!token) {
    throw new AppError("Verification token is required", 400);
  }

  const user = await UserModel.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Verification link is invalid or has expired", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return { message: "Email address verified successfully", user };
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
    refreshToken,
  };
};

export const requestPasswordReset = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return { message: "If an account exists, a password reset link has been sent to your email" };
  }

  if (user.googleId && !user.password) {
    throw new AppError("Google authenticated accounts cannot reset password directly", 400);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpires;
  await user.save();

  await emailService.sendPasswordReset(user.email, resetToken);
  return { message: "If an account exists, a password reset link has been sent to your email" };
};

export const verifyResetToken = async (token: string) => {
  if (!token) {
    throw new AppError("Reset token is required", 400);
  }

  const user = await UserModel.findOne({ resetPasswordToken: token });

  if (!user) {
    throw new AppError("Password reset link is invalid", 400);
  }

  if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new AppError("Password reset link has expired", 400);
  }

  return { message: "Token is valid", email: user.email };
};

export const confirmPasswordResetWithToken = async (data: any) => {
  const { token, newPassword, otp, email } = data;

  // Support token-based password reset
  let user = null;

  if (token) {
    user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Password reset link is invalid or has expired", 400);
    }
  } else if (email && otp) {
    user = await UserModel.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    await OTPService.verifyOTP(email, otp, OTPType.PASSWORD_RESET);
  } else {
    throw new AppError("Reset token or verification details are required", 400);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Password has been successfully reset" };
};

export const changePassword = async (userId: string, data: any) => {
  const { currentPassword, newPassword } = data;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.googleId && !user.password) {
    throw new AppError("Google authenticated users cannot change password directly", 400);
  }

  if (currentPassword) {
    if (!user.password) {
      throw new AppError("Current password is required", 400);
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError("Incorrect current password", 400);
    }
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: "Password changed successfully" };
};

