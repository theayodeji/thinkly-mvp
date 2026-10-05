import { Request, Response } from "express";
import User from "../models/User.js";

export const updatePreferences = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).userId;
    const { theme, defaultVoice, quizDifficulty, emailReminders } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.preferences) {
      user.preferences = {
        theme: "system",
        defaultVoice: "hip",
        quizDifficulty: "intermediate",
        emailReminders: true
      };
    }

    if (theme) user.preferences.theme = theme;
    if (defaultVoice) user.preferences.defaultVoice = defaultVoice;
    if (quizDifficulty) user.preferences.quizDifficulty = quizDifficulty;
    if (emailReminders !== undefined) user.preferences.emailReminders = emailReminders;

    await user.save();

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
