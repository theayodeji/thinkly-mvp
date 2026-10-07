import type { Request, Response, NextFunction } from "express";
import { getPlanConfigs, getAppMode, PlanTier, FeatureFlag, PlanConfig } from "@thinkly/shared";
import SpaceModel from "../models/Space.js";
import UserModel from "../models/User.js";
import UserUsageModel from "../models/UserUsage.js";
import ChatMessageModel from "../models/ChatMessage.js"; // or wherever messages are
import { AppError } from "../utils/AppError.js";

export const getUserPlanConfig = (tier?: string): PlanConfig => {
  const mode = getAppMode(process.env.APP_MODE);
  const configs = getPlanConfigs(mode);
  const mappedTier = (tier as PlanTier) || PlanTier.FREE;
  return configs[mappedTier] || configs[PlanTier.FREE];
};

export const checkFeatureAccess = (feature: FeatureFlag) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.isGuest) return next();
      
      const userId = req.userId;
      if (!userId) return next(new AppError("Unauthorized", 401));

      // We still need the user's tier. We can store it in req.user, or fetch it.
      const user = await UserModel.findById(userId).select("subscription_tier");
      if (!user) return next(new AppError("User not found", 404));

      const planConfig = getUserPlanConfig(user.subscription_tier);
      const mode = getAppMode(process.env.APP_MODE);

      if (!planConfig.allowedFeatures.includes(feature)) {
        const errorMsg = mode === "beta"
          ? "Thinkly Beta limit reached. A full version is coming soon with higher limits!"
          : "This feature is locked on your current plan. Upgrade to PRO to unlock!";
        return next(new AppError(errorMsg, 403));
      }

      // Attach plan config to request for subsequent checks
      (req as any).planConfig = planConfig;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkSpaceCreationLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.isGuest) return next();
    
    const userId = req.userId;
    if (!userId) return next(new AppError("Unauthorized", 401));

    const user = await UserModel.findById(userId).select("subscription_tier");
    const planConfig = getUserPlanConfig(user?.subscription_tier);
    const mode = getAppMode(process.env.APP_MODE);

    if (!planConfig.allowedFeatures.includes(FeatureFlag.CREATE_SPACE)) {
      return next(new AppError("Creating study spaces is locked on your current plan. Upgrade to PRO to unlock!", 403));
    }

    const maxActiveSpaces = planConfig.limits.maxActiveSpaces;
    if (maxActiveSpaces === Infinity) return next();

    const activeSpacesCount = await SpaceModel.countDocuments({ userId });
    if (activeSpacesCount >= maxActiveSpaces) {
      const errorMsg = mode === "beta"
        ? "Thinkly Beta limit reached. A full version is coming soon with higher limits!"
        : `You have reached the maximum limit of ${maxActiveSpaces} active study spaces. Upgrade to PRO for unlimited spaces!`;
      return next(new AppError(errorMsg, 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Map feature flag to the limit property
const limitKeyMap: Record<FeatureFlag, keyof PlanConfig["limits"] | null> = {
  [FeatureFlag.GENERATE_QUIZ]: "maxDailyQuizGenerations",
  [FeatureFlag.GENERATE_FLASHCARDS]: "maxDailyFlashcardGenerations",
  [FeatureFlag.GENERATE_AUDIO]: "maxDailyAudioGenerations",
  [FeatureFlag.GENERATE_LEARNING_PATH]: "maxDailyLearningPathGenerations",
  [FeatureFlag.AI_CHAT]: "maxDailyChatMessages",
  [FeatureFlag.CREATE_SPACE]: null,
};

export const checkMeteredLimit = (feature: FeatureFlag) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.isGuest) return next();

      const userId = req.userId;
      if (!userId) return next(new AppError("Unauthorized", 401));

      let planConfig = (req as any).planConfig as PlanConfig;
      if (!planConfig) {
        const user = await UserModel.findById(userId).select("subscription_tier");
        planConfig = getUserPlanConfig(user?.subscription_tier);
      }

      const mode = getAppMode(process.env.APP_MODE);

      // Special handling for Beta Chat Messages (tracked per space, not daily)
      if (mode === "beta" && feature === FeatureFlag.AI_CHAT) {
        const spaceId = req.params.spaceId || req.body.spaceId;
        const maxMessages = planConfig.limits.maxMessagesPerSpace;
        
        if (maxMessages && maxMessages !== Infinity) {
          // In real implementation, this would import the actual Message model
          // We assume ChatMessageModel exists. If not, we will need to query the right collection.
          try {
             // Let's dynamically import or require the right model to be safe since we don't have the exact path here yet
             const MessageModel = (await import("../models/ChatMessage.js")).default;
             const msgCount = await MessageModel.countDocuments({ spaceId, role: "user" });
             if (msgCount >= maxMessages) {
               return res.status(403).json({
                 status: "fail",
                 code: "LIMIT_REACHED",
                 message: `You have reached the ${maxMessages}-message limit for this space in Beta. Delete this space and create another to start fresh!`,
               });
             }
             return next();
          } catch(e) {
             console.error(e);
             return next(); // Fallback if MessageModel doesn't exist
          }
        } else {
          return next();
        }
      }

      // Universal Quota Engine: Atomic Check and Increment
      const limitKey = limitKeyMap[feature];
      if (!limitKey) return next();

      const limitAmount = planConfig.limits[limitKey] as number;
      if (limitAmount === Infinity) return next();
      if (limitAmount === 0) return next(new AppError("Feature locked on current plan", 403));

      // Get current date stripped to midnight UTC
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Atomic update
      const usage = await UserUsageModel.findOneAndUpdate(
        { userId, feature },
        {
          $setOnInsert: { userId, feature },
        },
        { upsert: true, new: true }
      );

      // Check if window has expired
      let currentAmount = usage.consumedAmount;
      if (usage.windowStart < today) {
         // reset
         usage.consumedAmount = 0;
         usage.windowStart = today;
         currentAmount = 0;
      }

      if (currentAmount >= limitAmount) {
         const errorMsg = mode === "beta"
            ? "Thinkly Beta limit reached. A full version is coming soon with higher limits!"
            : `Daily limit reached (${limitAmount}/day). Upgrade to PRO for higher limits!`;
         
         return res.status(403).json({
           status: "fail",
           code: "LIMIT_REACHED",
           message: errorMsg,
         });
      }

      // We increment the limit immediately here. If the controller fails, it consumes a token.
      // This is a common design pattern for rate limiting to prevent abuse.
      usage.consumedAmount += 1;
      await usage.save();

      next();
    } catch (error) {
      next(error);
    }
  };
};
