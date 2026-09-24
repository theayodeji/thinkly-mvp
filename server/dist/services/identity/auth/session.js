import UserModel from "../../../models/User.js";
import jwt from "jsonwebtoken";
import { config } from "../../../config/env.js";
import { generateToken } from "../../../utils/jwt.js";
import { StreakService } from "../user/streaks.js";
import { AppError } from "../../../utils/AppError.js";
export const verifyUserAuth = async (userId) => {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return await StreakService.handleUpdateStreak(user, false);
};
export const refreshUserToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError("No refresh token provided", 403);
    }
    const decoded = jwt.verify(refreshToken, config.REFRESH_SECRET);
    const newAccessToken = generateToken(decoded.id);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    await StreakService.handleUpdateStreak(user, false);
    return newAccessToken;
};
