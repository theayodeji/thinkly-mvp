import eventBus from "../eventBus.js";
import { IUser } from "../../../types/entities.js";

const handleStreak = async (user: IUser) => {
  
    if (!user) return;

    const today = new Date().toDateString();
    const lastActive = user.streaks.lastActive?.toDateString();
  
    if (lastActive === today) return; // already logged today
  
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    // If user logged in yesterday too, continue streak
    if (lastActive === yesterday.toDateString()) {
      user.streaks.current += 1;
    } else {
      // streak broken, reset
      user.streaks.current = 1;
    }
  
    // update longest streak if applicable
    if (user.streaks.current > user.streaks.longest) {
      user.streaks.longest = user.streaks.current;
    }
  
    user.streaks.lastActive = new Date();
    await user.save();
  
    // Optional: emit streak updated event (for UI or analytics)
    // eventBus.emit('streak.updated', userId, {
    //   current: user.streaks.current,
    //   longest: user.streaks.longest,
    // });

};

eventBus.on('user_login', handleStreak);
