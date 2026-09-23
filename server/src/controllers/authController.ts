import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/User.js";
import { Types } from "mongoose";
import { generateToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import type { IUser } from "../types/entities.js";
import {
  setAuthTokens,
  setAccessTokenCookie,
  clearAuthCookies,
} from "../utils/auth.js";
import { StreakService } from "../services/streakService.js";
import { config } from "../config/env.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
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

  const tokens = setAuthTokens(res, accessToken, refreshToken);

  res.json({
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      streaks: updatedUser.streaks,
      badges: updatedUser.badges,
    },
    ...tokens,
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  // Check if user is an OAuth user trying to use password login
  if (user.googleId && !user.password) {
    throw new AppError("Please sign in with Google", 400);
  }

  // Verify password for non-OAuth users
  if (!user.password) {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const accessToken = generateToken(user._id);
  const refreshToken = generateToken(user._id, true);

  const tokens = setAuthTokens(res, accessToken, refreshToken);
  const updatedUser = await StreakService.handleUpdateStreak(user, true);
  await updatedUser.save();

  res.status(200).json({
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      streaks: updatedUser.streaks,
      badges: updatedUser.badges,
    },
    ...tokens,
  });
});

export const checkAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // req.userId is already an ObjectId from auth middleware
  const user = await UserModel.findById(req.userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const updatedUser = await StreakService.handleUpdateStreak(user, false);
  res.status(200).json(updatedUser);
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get refresh token from cookies
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("No refresh token provided", 403);
  }

  const decoded = jwt.verify(refreshToken, config.REFRESH_SECRET) as {
    id: Types.ObjectId;
  };
  const newAccessToken = generateToken(decoded.id);
  const user = await UserModel.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await StreakService.handleUpdateStreak(user, false);

  // Set new access token as HTTP-only cookie
  setAccessTokenCookie(res, newAccessToken);
  return res.json({});
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  clearAuthCookies(res);
  return res.status(200).json({ message: "Logged out successfully" });
});

export const googleLogin = passport.authenticate("google", {
  session: false,
  scope: ["profile", "email"],
  failureRedirect: `${config.FRONTEND_URL}/login?error=google_auth_failed`,
});

export const googleCallback = async (req: Request, res: Response) => {
  try {
    // This will be called after successful Google authentication
    const userEmail = (req.user as IUser)?.email;
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      throw new Error("No user returned from Google OAuth");
    }
    await StreakService.handleUpdateStreak(user, false);

    const accessToken = generateToken(user._id);
    const refreshToken = generateToken(user._id, true);
    const tokens = setAuthTokens(res, accessToken, refreshToken);

    const frontendUrl = new URL(config.FRONTEND_URL + "/oauth/callback");
    res.redirect(frontendUrl.toString());
  } catch (error) {
    console.error("Google OAuth error:", error);
    const frontendUrl = new URL(config.FRONTEND_URL + "/auth/login");
    frontendUrl.searchParams.set("error", "google_auth_failed");
    res.redirect(frontendUrl.toString());
  }
};
