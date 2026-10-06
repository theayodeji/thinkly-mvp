import type { Request, Response, NextFunction } from "express";
import { PLAN_CONFIGS, PlanTier, FeatureFlag } from "@thinkly/shared";
import SpaceModel from "../models/Space.js";
import UserModel from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const getUserPlanConfig = (plan?: string) => {
  const tier = (plan as PlanTier) || PlanTier.FREE;
  return PLAN_CONFIGS[tier] || PLAN_CONFIGS[PlanTier.FREE];
};

export const checkSpaceCreationLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return next(new AppError("Unauthorized", 401));

    if (req.isGuest) {
      return next();
    }

    const user = await UserModel.findById(userId);
    const planConfig = getUserPlanConfig(user?.plan);

    if (!planConfig.allowedFeatures.includes(FeatureFlag.CREATE_SPACE)) {
      return next(new AppError("Creating study spaces is locked on your current plan. Upgrade to PRO to unlock!", 403));
    }

    const activeSpacesCount = await SpaceModel.countDocuments({ userId });
    if (activeSpacesCount >= planConfig.limits.maxActiveSpaces) {
      return next(
        new AppError(
          `You have reached the maximum limit of ${planConfig.limits.maxActiveSpaces} active study spaces on the ${planConfig.name} plan. Upgrade to PRO for unlimited spaces!`,
          403
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkDailyAIActionsLimit = (feature: FeatureFlag) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) return next(new AppError("Unauthorized", 401));

      if (req.isGuest) {
        return next();
      }

      const user = await UserModel.findById(userId);
      if (!user) return next(new AppError("User not found", 404));

      const planConfig = getUserPlanConfig(user.plan);

      if (!planConfig.allowedFeatures.includes(feature)) {
        return next(new AppError("This feature is locked on your current plan. Upgrade to PRO to unlock!", 403));
      }

      const todayStr = new Date().toISOString().slice(0, 10);
      const isAudio = feature === FeatureFlag.GENERATE_AUDIO;

      if (isAudio) {
        const lastAudioStr = user.lastAudioActionDate ? new Date(user.lastAudioActionDate).toISOString().slice(0, 10) : "";
        let currentAudioCount = user.dailyAudioActionsCount || 0;
        if (todayStr !== lastAudioStr) {
          currentAudioCount = 0;
        }

        const maxAudio = planConfig.limits.maxDailyAudioGenerations ?? 1;
        if (currentAudioCount >= maxAudio) {
          return next(
            new AppError(
              `Daily voice generation limit reached (${maxAudio}/day). Upgrade to PRO for higher limits!`,
              403
            )
          );
        }

        user.dailyAudioActionsCount = currentAudioCount + 1;
        user.lastAudioActionDate = new Date();
      } else {
        const lastActionStr = user.lastAIActionDate ? new Date(user.lastAIActionDate).toISOString().slice(0, 10) : "";
        let currentDailyCount = user.dailyAIActionsCount || 0;
        if (todayStr !== lastActionStr) {
          currentDailyCount = 0;
        }

        if (currentDailyCount >= planConfig.limits.maxDailyAIActions) {
          return next(
            new AppError(
              `Daily AI generation limit reached (${planConfig.limits.maxDailyAIActions}/day) on the ${planConfig.name} plan. Upgrade to PRO for unlimited AI generations!`,
              403
            )
          );
        }

        user.dailyAIActionsCount = currentDailyCount + 1;
        user.lastAIActionDate = new Date();
      }

      await user.save();
      next();
    } catch (error) {
      next(error);
    }
  };
};
