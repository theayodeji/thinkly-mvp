import { Request, Response } from "express";
import User from "../models/User.js";

export const completeSession = async (req: Request, res: Response) => {
  const userId = req.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.pomodoros.completed += 1;
  user.pomodoros.lastCompletedAt = new Date();
  await user.save();

  res.json({ message: "Pomodoro session completed" });
};
