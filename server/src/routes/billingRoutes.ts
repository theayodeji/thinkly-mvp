import express from "express";
import {
  initializeSubscription,
  paystackWebhook,
  getCurrentUserPlan,
} from "../controllers/billingController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.post("/initialize", authenticateJWT, initializeSubscription);
router.get("/plan", authenticateJWT, getCurrentUserPlan);
router.post("/webhook", paystackWebhook);

export default router;
