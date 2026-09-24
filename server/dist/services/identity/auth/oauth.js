import UserModel from "../../../models/User.js";
import { generateToken } from "../../../utils/jwt.js";
import { StreakService } from "../user/streaks.js";
export const handleGoogleCallback = async (reqUser) => {
    const userEmail = reqUser?.email;
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
        throw new Error("No user returned from Google OAuth");
    }
    await StreakService.handleUpdateStreak(user, false);
    const accessToken = generateToken(user._id);
    const refreshToken = generateToken(user._id, true);
    return { accessToken, refreshToken };
};
