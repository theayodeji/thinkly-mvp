export enum PlanTier {
  FREE = "free",
  PRO = "pro",
}

export enum FeatureFlag {
  CREATE_SPACE = "create_space",
  GENERATE_QUIZ = "generate_quiz",
  GENERATE_FLASHCARDS = "generate_flashcards",
  GENERATE_AUDIO = "generate_audio",
  GENERATE_LEARNING_PATH = "generate_learning_path",
  AI_CHAT = "ai_chat",
}

export interface PlanLimits {
  maxActiveSpaces: number;
  maxMessagesPerSpace?: number;
  maxDailyChatMessages?: number;
  maxDailyQuizGenerations: number;
  maxDailyFlashcardGenerations: number;
  maxDailyAudioGenerations: number;
  maxDailyLearningPathGenerations: number;
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

// Global dynamic file upload limit (Default: 5 MB for everyone for now)
export const DEFAULT_MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const getMaxUploadSizeBytes = (overrideBytes?: number): number => {
  if (overrideBytes !== undefined && overrideBytes > 0) {
    return overrideBytes;
  }
  const envBytes =
    typeof globalThis !== "undefined" && (globalThis as Record<string, any>).process?.env?.MAX_UPLOAD_SIZE_BYTES
      ? parseInt((globalThis as Record<string, any>).process.env.MAX_UPLOAD_SIZE_BYTES, 10)
      : undefined;
  return !isNaN(envBytes as number) && (envBytes as number) > 0
    ? (envBytes as number)
    : DEFAULT_MAX_UPLOAD_SIZE_BYTES;
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
      maxActiveSpaces: 1,
      maxMessagesPerSpace: 20,
      maxDailyQuizGenerations: 1,
      maxDailyFlashcardGenerations: 1,
      maxDailyAudioGenerations: 1,
      maxDailyLearningPathGenerations: 2,
      maxUploadSizeBytes: DEFAULT_MAX_UPLOAD_SIZE_BYTES,
    },
    allowedFeatures: [
      FeatureFlag.CREATE_SPACE,
      FeatureFlag.GENERATE_QUIZ,
      FeatureFlag.GENERATE_FLASHCARDS,
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
      maxActiveSpaces: 1,
      maxMessagesPerSpace: 20,
      maxDailyQuizGenerations: 1,
      maxDailyFlashcardGenerations: 1,
      maxDailyAudioGenerations: 1,
      maxDailyLearningPathGenerations: 2,
      maxUploadSizeBytes: DEFAULT_MAX_UPLOAD_SIZE_BYTES,
    },
    allowedFeatures: [
      FeatureFlag.CREATE_SPACE,
      FeatureFlag.GENERATE_QUIZ,
      FeatureFlag.GENERATE_FLASHCARDS,
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
      maxDailyChatMessages: 25,
      maxDailyQuizGenerations: 2,
      maxDailyFlashcardGenerations: 2,
      maxDailyAudioGenerations: 0,
      maxDailyLearningPathGenerations: 0,
      maxUploadSizeBytes: DEFAULT_MAX_UPLOAD_SIZE_BYTES,
    },
    allowedFeatures: [
      FeatureFlag.CREATE_SPACE,
      FeatureFlag.GENERATE_QUIZ,
      FeatureFlag.GENERATE_FLASHCARDS,
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
      maxDailyChatMessages: Infinity,
      maxDailyQuizGenerations: Infinity,
      maxDailyFlashcardGenerations: Infinity,
      maxDailyAudioGenerations: 10,
      maxDailyLearningPathGenerations: Infinity,
      maxUploadSizeBytes: DEFAULT_MAX_UPLOAD_SIZE_BYTES,
    },
    allowedFeatures: [
      FeatureFlag.CREATE_SPACE,
      FeatureFlag.GENERATE_QUIZ,
      FeatureFlag.GENERATE_FLASHCARDS,
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
