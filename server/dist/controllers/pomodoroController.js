import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
export const completeSession = catchAsync(async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    user.pomodoros.completed += 1;
    user.pomodoros.lastCompletedAt = new Date();
    await user.save();
    res.json({ message: "Pomodoro session completed" });
});
