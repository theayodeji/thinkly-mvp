import type { Request, Response } from "express";
import UserModel from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import { initializePaystackTransaction, verifyPaystackSignature } from "../utils/paystack.js";
import { PLAN_CONFIGS, PlanTier } from "@thinkly/shared";

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

  // Use rawBody if present or stringified req.body
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
      await UserModel.findByIdAndUpdate(userId, { plan });
      console.log(`[Paystack Webhook] User ${userId} upgraded to ${plan} tier!`);
    }
  }

  res.status(200).send("Webhook received");
});

export const getCurrentUserPlan = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await UserModel.findById(userId);
  const plan = user?.plan || PlanTier.FREE;
  const planConfig = PLAN_CONFIGS[plan] || PLAN_CONFIGS[PlanTier.FREE];

  res.status(200).json({
    userPlan: plan,
    config: planConfig,
    dailyAIActionsCount: user?.dailyAIActionsCount || 0,
    lastAIActionDate: user?.lastAIActionDate || null,
  });
});
