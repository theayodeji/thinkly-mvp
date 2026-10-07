import { useQuery } from "@tanstack/react-query";
import { billingService } from "../shared/services/billingService";
import { FeatureFlag } from "@thinkly/shared";
import { useAuth } from "./useAuth";

export enum MeteredMetric {
  ACTIVE_SPACES = "active_spaces",
  CHAT_MESSAGES = "chat_messages",
  QUIZZES = "quizzes",
  FLASHCARDS = "flashcards",
  AUDIO_EXPLAINERS = "audio_explainers",
  LEARNING_PATHS = "learning_paths",
}

interface LimitStatus {
  current: number;
  max: number;
  remaining: number;
  isReached: boolean;
  isLocked: boolean;
}

export function usePermissionsAndLimits() {
  const { user } = useAuth();
  const { data: planStatus, isLoading } = useQuery({
    queryKey: ["userPlanStatus"],
    queryFn: billingService.getPlanStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const canAccess = (feature: FeatureFlag): boolean => {
    if (!planStatus) return false;
    return planStatus.config.allowedFeatures.includes(feature);
  };

  const triggerLimitModal = (reason?: string) => {
    const isGuest = !user || user.isGuest;
    if (isGuest) {
      window.dispatchEvent(
        new CustomEvent("thinkly:auth-prompt-modal", {
          detail: { reason: reason || "Sign up or log in to create a free account and unlock full access!" },
        })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("thinkly:upgrade-modal", { detail: { reason } })
      );
    }
  };

  const getLimitStatus = (metric: MeteredMetric, spaceContext?: { spaceId: string; messagesCount: number }): LimitStatus => {
    if (!planStatus) {
      return { current: 0, max: 0, remaining: 0, isReached: false, isLocked: false };
    }

    const { config, usagesMap } = planStatus;
    let current = 0;
    let max = 0;
    let featureKey: FeatureFlag | null = null;
    let isLocked = false;

    switch (metric) {
      case MeteredMetric.ACTIVE_SPACES:
        // Current isn't fully known here without querying spaces API
        // But this hook expects components to handle active spaces logic 
        // We will just provide the max limit.
        max = config.limits.maxActiveSpaces;
        featureKey = FeatureFlag.CREATE_SPACE;
        break;
      case MeteredMetric.CHAT_MESSAGES:
        const isBeta = import.meta.env.VITE_APP_MODE !== "launch";
        if (isBeta && spaceContext) {
           current = spaceContext.messagesCount;
           max = config.limits.maxMessagesPerSpace || 20;
        } else {
           current = usagesMap?.[FeatureFlag.AI_CHAT] || 0;
           max = config.limits.maxDailyChatMessages || 0;
        }
        featureKey = FeatureFlag.AI_CHAT;
        break;
      case MeteredMetric.QUIZZES:
        current = usagesMap?.[FeatureFlag.GENERATE_QUIZ] || 0;
        max = config.limits.maxDailyQuizGenerations;
        featureKey = FeatureFlag.GENERATE_QUIZ;
        break;
      case MeteredMetric.FLASHCARDS:
        current = usagesMap?.[FeatureFlag.GENERATE_FLASHCARDS] || 0;
        max = config.limits.maxDailyFlashcardGenerations;
        featureKey = FeatureFlag.GENERATE_FLASHCARDS;
        break;
      case MeteredMetric.AUDIO_EXPLAINERS:
        current = usagesMap?.[FeatureFlag.GENERATE_AUDIO] || 0;
        max = config.limits.maxDailyAudioGenerations;
        featureKey = FeatureFlag.GENERATE_AUDIO;
        break;
      case MeteredMetric.LEARNING_PATHS:
        current = usagesMap?.[FeatureFlag.GENERATE_LEARNING_PATH] || 0;
        max = config.limits.maxDailyLearningPathGenerations;
        featureKey = FeatureFlag.GENERATE_LEARNING_PATH;
        break;
    }

    if (featureKey && !config.allowedFeatures.includes(featureKey)) {
      isLocked = true;
    }

    // Treat max = 0 as locked for metered actions
    if (max === 0) {
      isLocked = true;
    }

    const remaining = max === Infinity ? Infinity : Math.max(0, max - current);
    const isReached = !isLocked && remaining <= 0;

    return { current, max, remaining, isReached, isLocked };
  };

  return { planStatus, isLoading, canAccess, getLimitStatus, triggerLimitModal };
}
