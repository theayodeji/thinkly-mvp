import mongoose from "mongoose";
import "dotenv/config";
import { config } from "../config/env.js";
import GuestSession from "../models/GuestSession.js";
import Space from "../models/Space.js";
import Source from "../models/Source.js";
import Flashcard from "../models/Flashcard.js";
import LearningPath from "../models/LearningPath.js";
import ChatMessage from "../models/ChatMessage.js";
import Quiz from "../models/Quiz.js";
import AudioExplainer from "../models/AudioExplainer.js";

/**
 * Script to clean up expired guest trial sessions and all associated guest spaces/content.
 */
export const runGuestCleanup = async () => {
  console.log("🧹 Starting guest trial data cleanup script...");

  const now = new Date();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 1. Delete expired GuestSession documents
  const deletedSessions = await GuestSession.deleteMany({
    $or: [{ expiresAt: { $lte: now } }, { createdAt: { $lt: twentyFourHoursAgo } }],
  });

  // 2. Find all guest spaces created > 24h ago or with expiresAt passed
  const expiredGuestSpaces = await Space.find({
    $or: [
      { isGuest: true },
      { expiresAt: { $exists: true, $lte: now } },
      { createdAt: { $lt: twentyFourHoursAgo } },
    ],
  });

  const spaceIds = expiredGuestSpaces.map((s) => s._id);

  if (spaceIds.length > 0) {
    const deletedSources = await Source.deleteMany({ spaceId: { $in: spaceIds } });
    const deletedFlashcards = await Flashcard.deleteMany({ spaceId: { $in: spaceIds } });
    const deletedLearningPaths = await LearningPath.deleteMany({ spaceId: { $in: spaceIds } });
    const deletedChatMessages = await ChatMessage.deleteMany({ spaceId: { $in: spaceIds } });
    const deletedQuizzes = await Quiz.deleteMany({ spaceId: { $in: spaceIds } });
    const deletedExplainers = await AudioExplainer.deleteMany({ spaceId: { $in: spaceIds } });
    const deletedSpaces = await Space.deleteMany({ _id: { $in: spaceIds } });

    console.log(`✅ Cleanup finished!
- Expired Guest Sessions Purged: ${deletedSessions.deletedCount}
- Guest Spaces Purged: ${deletedSpaces.deletedCount}
- Associated Sources Purged: ${deletedSources.deletedCount}
- Associated Flashcards Purged: ${deletedFlashcards.deletedCount}
- Associated Learning Paths Purged: ${deletedLearningPaths.deletedCount}
- Associated Chat Messages Purged: ${deletedChatMessages.deletedCount}`);
  } else {
    console.log(`✅ Cleanup finished! No expired guest trial spaces found.`);
  }
};

// Execute if run directly from command line
if (process.argv[1]?.includes("cleanupGuestData")) {
  mongoose
    .connect(config.MONGO_URL)
    .then(async () => {
      await runGuestCleanup();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Cleanup failed:", err);
      process.exit(1);
    });
}
