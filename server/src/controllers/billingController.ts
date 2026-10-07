import type { Request, Response } from "express";
import UserModel from "../models/User.js";
import UserUsageModel from "../models/UserUsage.js";
import UserBillingSubscriptionModel from "../models/UserBillingSubscription.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import { initializePaystackTransaction, verifyPaystackSignature } from "../utils/paystack.js";
import { getPlanConfigs, getAppMode, PlanTier } from "@thinkly/shared";

export const initializeSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await UserModel.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const requestedPlan = (req.body.plan as PlanTier) || PlanTier.PRO;
  const paystackData = await initializePaystackTransaction(user.email, userId, requestedPlan);

  res.status(200).json(paystackData);
});

export const paystackWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string;

  const rawBody = (req as any).rawBody || JSON.stringify(req.body);
  const isValid = verifyPaystackSignature(rawBody, signature);

  if (!isValid && process.env.NODE_ENV === "production") {
    throw new AppError("Invalid Paystack webhook signature", 400);
  }

  const event = req.body;

  if (event && event.event === "charge.success") {
    const metadata = event.data?.metadata;
    const userId = metadata?.userId;
    const plan = (metadata?.plan as PlanTier) || PlanTier.PRO;

    if (userId) {
      await UserModel.findByIdAndUpdate(userId, { 
        subscription_tier: plan === PlanTier.PRO ? "premium" : "free",
        subscription_status: "active"
      });
      
      await UserBillingSubscriptionModel.findOneAndUpdate(
        { userId },
        {
          userId,
          provider: "paystack",
          providerSubscriptionId: event.data?.reference || event.data?.id,
          providerCustomerId: event.data?.customer?.id,
          planId: plan,
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approximate 30 days
        },
        { upsert: true }
      );

      console.log(`[Paystack Webhook] User ${userId} upgraded to ${plan} tier!`);
    }
  }

  res.status(200).send("Webhook received");
});

export const getCurrentUserPlan = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await UserModel.findById(userId);
  const mode = getAppMode(process.env.APP_MODE);
  const configs = getPlanConfigs(mode);
  
  const mappedTier = user?.subscription_tier === "premium" ? PlanTier.PRO : PlanTier.FREE;
  const planConfig = configs[mappedTier] || configs[PlanTier.FREE];

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const usages = await UserUsageModel.find({ userId, windowStart: { $gte: today } });
  
  // Aggregate total AI actions for backward compatibility if needed
  const dailyAIActionsCount = usages.reduce((sum, u) => sum + u.consumedAmount, 0);

  res.status(200).json({
    userPlan: mappedTier,
    config: planConfig,
    dailyAIActionsCount,
    lastAIActionDate: today,
  });
});
