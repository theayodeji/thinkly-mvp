import bcrypt from "bcryptjs";
import UserModel from "../../../models/User.js";
import { generateToken } from "../../../utils/jwt.js";
import { StreakService } from "../user/streaks.js";
import { AppError } from "../../../utils/AppError.js";
import { OTPService } from "../otp/OTPService.js";
import { OTPType } from "@thinkly/shared";

export const sendOTP = async (email: string, type: OTPType) => {
  // If sending password reset OTP, check if user exists first
  if (type === OTPType.PASSWORD_RESET) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Return success to prevent email enumeration
      return { message: "If an account exists, a verification code was sent" };
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
  const { name, email, password, otp } = data;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // Verify OTP for email registration
  if (!otp) {
    throw new AppError("Verification code is required for registration", 400);
  }
  await OTPService.verifyOTP(email, otp, OTPType.EMAIL_VERIFICATION);

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
    refreshToken,
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
    refreshToken,
  };
};

export const requestPasswordReset = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return { message: "If an account exists, a verification code was sent" };
  }

  await OTPService.generateAndSendOTP(email, OTPType.PASSWORD_RESET);
  return { message: "If an account exists, a verification code was sent" };
};

export const confirmPasswordResetWithOTP = async (data: any) => {
  const { email, otp, newPassword } = data;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify OTP
  await OTPService.verifyOTP(email, otp, OTPType.PASSWORD_RESET);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: "Password has been successfully reset" };
};

export const changePassword = async (userId: string, data: any) => {
  const { currentPassword, newPassword, otp } = data;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.googleId && !user.password) {
    throw new AppError("Google authenticated users cannot change password directly", 400);
  }

  // If OTP is provided, verify it (for security action)
  if (otp) {
    await OTPService.verifyOTP(user.email, otp, OTPType.SECURITY_ACTION);
  } else if (currentPassword) {
    if (!user.password) {
      throw new AppError("Current password is required", 400);
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError("Incorrect current password", 400);
    }
  } else {
    throw new AppError("Either current password or verification code is required", 400);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: "Password changed successfully" };
};
