import crypto from "crypto";
import axios from "axios";
import { AppError } from "./AppError.js";
import { PLAN_CONFIGS, PlanTier } from "@thinkly/shared";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export const verifyPaystackSignature = (rawBody: Buffer | string, signature: string): boolean => {
  if (!PAYSTACK_SECRET_KEY || !signature) return false;
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
};

export const initializePaystackTransaction = async (
  email: string,
  userId: string,
  plan: PlanTier = PlanTier.PRO
) => {
  if (!PAYSTACK_SECRET_KEY) {
    throw new AppError("Paystack secret key is not configured on the server", 500);
  }

  const planConfig = PLAN_CONFIGS[plan];
  if (!planConfig || planConfig.priceNGN <= 0) {
    throw new AppError("Invalid or free subscription plan requested", 400);
  }

  // Paystack expects amount in Kobo (1 NGN = 100 Kobo)
  const amountInKobo = planConfig.priceNGN * 100;
  const callbackUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard?payment=success`;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amountInKobo,
        callback_url: callbackUrl,
        metadata: {
          userId,
          plan,
          custom_fields: [
            {
              display_name: "Plan Name",
              variable_name: "plan_name",
              value: planConfig.name,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data as {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  } catch (error: any) {
    console.error("Paystack Initialize Error:", error.response?.data || error.message);
    throw new AppError("Failed to initialize Paystack checkout", 500);
  }
};
