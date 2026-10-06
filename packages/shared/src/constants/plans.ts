export enum PlanTier {
  FREE = "free",
  PRO = "pro",
}

export enum FeatureFlag {
  CREATE_SPACE = "create_space",
  GENERATE_QUIZ = "generate_quiz",
  GENERATE_AUDIO = "generate_audio",
  GENERATE_LEARNING_PATH = "generate_learning_path",
  AI_CHAT = "ai_chat",
}

export interface PlanLimits {
  maxActiveSpaces: number;
  maxDailyAIActions: number;
  maxDailyAudioGenerations: number;
  maxUploadSizeBytes: number;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  description: string;
  priceNGN: number;
  priceUSD: number;
  limits: PlanLimits;
  allowedFeatures: FeatureFlag[];
}

export type AppMode = "beta" | "launch";

export const getAppMode = (modeStr?: string): AppMode => {
  return modeStr === "launch" ? "launch" : "beta";
};

// Beta Mode Configs (Generous general limits, strict 1 voice generation per day for everybody)
export const BETA_PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  [PlanTier.FREE]: {
    id: PlanTier.FREE,
    name: "Thinkly Beta",
    description: "Generous beta access for testing intelligent study tools.",
    priceNGN: 0,
    priceUSD: 0,
    limits: {
      maxActiveSpaces: 10,
      maxDailyAIActions: 20,
      maxDailyAudioGenerations: 1, // 1 voice generation per day for everybody
      maxUploadSizeBytes: 20 * 1024 * 1024,
    },
    allowedFeatures: [
      FeatureFlag.CREATE_SPACE,
      FeatureFlag.GENERATE_QUIZ,
      FeatureFlag.GENERATE_AUDIO,
      FeatureFlag.GENERATE_LEARNING_PATH,
      FeatureFlag.AI_CHAT,
    ],
  },
  [PlanTier.PRO]: {
    id: PlanTier.PRO,
    name: "Thinkly Beta",
    description: "Generous beta access for testing intelligent study tools.",
    priceNGN: 0,
    priceUSD: 0,
    limits: {
      maxActiveSpaces: 10,
      maxDailyAIActions: 20,
      maxDailyAudioGenerations: 1,
      maxUploadSizeBytes: 20 * 1024 * 1024,
    },
    allowedFeatures: [
      FeatureFlag.CREATE_SPACE,
      FeatureFlag.GENERATE_QUIZ,
      FeatureFlag.GENERATE_AUDIO,
      FeatureFlag.GENERATE_LEARNING_PATH,
      FeatureFlag.AI_CHAT,
    ],
  },
};

// Full Launch Mode Configs (Paystack tiers, Free vs PRO limits)
export const LAUNCH_PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  [PlanTier.FREE]: {
    id: PlanTier.FREE,
    name: "Free Scholar",
    description: "Essential study tools for everyday learning.",
    priceNGN: 0,
    priceUSD: 0,
    limits: {
      maxActiveSpaces: 3,
      maxDailyAIActions: 5,
      maxDailyAudioGenerations: 1,
      maxUploadSizeBytes: 10 * 1024 * 1024,
    },
    allowedFeatures: [
      FeatureFlag.CREATE_SPACE,
      FeatureFlag.GENERATE_QUIZ,
      FeatureFlag.GENERATE_AUDIO,
      FeatureFlag.GENERATE_LEARNING_PATH,
      FeatureFlag.AI_CHAT,
    ],
  },
  [PlanTier.PRO]: {
    id: PlanTier.PRO,
    name: "Thinkly PRO",
    description: "Unlimited study spaces, unlimited AI generations, and priority TTS voice rendering.",
    priceNGN: 3500,
    priceUSD: 5,
    limits: {
      maxActiveSpaces: Infinity,
      maxDailyAIActions: Infinity,
      maxDailyAudioGenerations: 10,
      maxUploadSizeBytes: 50 * 1024 * 1024,
    },
    allowedFeatures: [
      FeatureFlag.CREATE_SPACE,
      FeatureFlag.GENERATE_QUIZ,
      FeatureFlag.GENERATE_AUDIO,
      FeatureFlag.GENERATE_LEARNING_PATH,
      FeatureFlag.AI_CHAT,
    ],
  },
};

export const getPlanConfigs = (mode: AppMode = "beta"): Record<PlanTier, PlanConfig> => {
  return mode === "launch" ? LAUNCH_PLAN_CONFIGS : BETA_PLAN_CONFIGS;
};

// Default backward compatibility export
export const PLAN_CONFIGS = BETA_PLAN_CONFIGS;
