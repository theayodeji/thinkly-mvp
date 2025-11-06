// services/streak.service.ts
import { differenceInDays, isSameDay, isYesterday } from "date-fns";
import { IUser } from "../types/entities.js";
import eventBus from "../lib/events/eventBus.js";

export class StreakService {
  static async handleUpdateStreak(user: IUser, isExplicitLogin: boolean) {
    try {
      const now = new Date();
      const lastActive = user.streaks?.lastActive;
      const streaks = user.streaks || { current: 0, longest: 0, lastActive: null };

      // Always check for streak updates on any user activity (login or token refresh)
      if (lastActive) {
        if (isSameDay(now, lastActive)) {
          // Same day, just update lastActive
          streaks.lastActive = now;
          return user;
        } else if (isYesterday(lastActive)) {
          // Consecutive day, increment streak
          streaks.current += 1;
          streaks.longest = Math.max(streaks.current, streaks.longest);
        } else {
          // Missed a day or more, reset streak
          streaks.current = 1;
        }
      } else {
        // First time tracking streak
        streaks.current = 1;
        streaks.longest = 1;
      }

      // Always update lastActive when we see the user
      streaks.lastActive = now;
      user.streaks = streaks;

      // 🏅 Check milestone
      const milestones = [3, 7, 14, 30];
      if (milestones.includes(streaks.current)) {
        const badgeId = `streak_${streaks.current}`;
        if (!user.badges.some(b => b.id === badgeId)) {
          user.badges.push({
            id: badgeId,
            title: `${streaks.current}-Day Streak`,
            level: this.getLevel(streaks.longest || streaks.current),
            earnedAt: now,
          });

          // Emit event (decoupled)
          eventBus.emit("streak.milestone", user._id, { streak: streaks.current });
        }
      }
      console.log("Streaked user",user.streaks)

      await user.save().then(() => {
        console.log("User saved successfully");
      });
      return user;
    } catch (error) {
      console.error("StreakService.handleLogin error:", error);
      throw error;
    }
  }

  private static getLevel(days: number) {
    if (days >= 30) return "platinum";
    if (days >= 14) return "gold";
    if (days >= 7) return "silver";
    return "bronze";
  }
}
