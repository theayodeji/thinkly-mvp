import bcrypt from "bcryptjs";
import UserModel from "../../../models/User.js";
import { generateToken } from "../../../utils/jwt.js";
import { StreakService } from "../user/streaks.js";
import { AppError } from "../../../utils/AppError.js";
export const registerUser = async (data) => {
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
export const loginUser = async (data) => {
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
