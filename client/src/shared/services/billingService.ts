import { api } from "./api";
import { PlanConfig, PlanTier } from "@thinkly/shared";

export interface UserPlanStatus {
  userPlan: PlanTier;
  config: PlanConfig;
  usagesMap?: Record<string, number>;
  dailyAIActionsCount: number;
  lastAIActionDate: string | null;
}

export const billingService = {
  getPlanStatus: async (): Promise<UserPlanStatus> => {
    const response = await api.get<UserPlanStatus>("/billing/plan");
    return response.data;
  },

  initializeCheckout: async (plan: PlanTier = PlanTier.PRO): Promise<{ authorization_url: string; access_code: string; reference: string }> => {
    const response = await api.post("/billing/initialize", { plan });
    return response.data;
  },
};
