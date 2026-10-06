import type { Request, Response, NextFunction } from "express";
import { getPlanConfigs, getAppMode, PlanTier, FeatureFlag } from "@thinkly/shared";
import SpaceModel from "../models/Space.js";
import UserModel from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const getUserPlanConfig = (plan?: string) => {
  const mode = getAppMode(process.env.APP_MODE);
  const configs = getPlanConfigs(mode);
  const tier = (plan as PlanTier) || PlanTier.FREE;
  return configs[tier] || configs[PlanTier.FREE];
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
    const mode = getAppMode(process.env.APP_MODE);

    if (!planConfig.allowedFeatures.includes(FeatureFlag.CREATE_SPACE)) {
      const errorMsg = mode === "beta"
        ? "Thinkly Beta limit reached. A full version is coming soon with higher limits!"
        : "Creating study spaces is locked on your current plan. Upgrade to PRO to unlock!";
      return next(new AppError(errorMsg, 403));
    }

    const activeSpacesCount = await SpaceModel.countDocuments({ userId });
    if (activeSpacesCount >= planConfig.limits.maxActiveSpaces) {
      const errorMsg = mode === "beta"
        ? "Thinkly Beta limit reached. A full version is coming soon with higher limits!"
        : `You have reached the maximum limit of ${planConfig.limits.maxActiveSpaces} active study spaces on the ${planConfig.name} plan. Upgrade to PRO for unlimited spaces!`;
      return next(new AppError(errorMsg, 403));
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
      const mode = getAppMode(process.env.APP_MODE);

      if (!planConfig.allowedFeatures.includes(feature)) {
        const errorMsg = mode === "beta"
          ? "Thinkly Beta limit reached. A full version is coming soon with higher limits!"
          : "This feature is locked on your current plan. Upgrade to PRO to unlock!";
        return next(new AppError(errorMsg, 403));
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
          const errorMsg = mode === "beta"
            ? "Thinkly Beta limit reached. A full version is coming soon with higher limits!"
            : `Daily voice generation limit reached (${maxAudio}/day). Upgrade to PRO for higher limits!`;
          return next(new AppError(errorMsg, 403));
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
          const errorMsg = mode === "beta"
            ? "Thinkly Beta limit reached. A full version is coming soon with higher limits!"
            : `Daily AI generation limit reached (${planConfig.limits.maxDailyAIActions}/day) on the ${planConfig.name} plan. Upgrade to PRO for unlimited AI generations!`;
          return next(new AppError(errorMsg, 403));
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
