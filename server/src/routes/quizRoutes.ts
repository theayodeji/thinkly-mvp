import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import {
  generateQuiz,
  getQuiz,
  submitQuiz,
} from "../controllers/quizController.js";
import { validateRequest } from "../middleware/validate.js";
import { checkFeatureAccess, checkMeteredLimit } from "../middleware/usageLimit.js";
import { submitQuizSchema, paramsSpaceIdSchema, paramsQuizIdSchema, FeatureFlag } from "@thinkly/shared";

import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/:spaceId/generate", authenticateJWT, aiLimiter, checkFeatureAccess(FeatureFlag.GENERATE_QUIZ), checkMeteredLimit(FeatureFlag.GENERATE_QUIZ), validateRequest(paramsSpaceIdSchema), generateQuiz);
router.get("/:spaceId", authenticateJWT, validateRequest(paramsSpaceIdSchema), getQuiz);
router.post(
  "/:quizId/submit",
  authenticateJWT,
  validateRequest(submitQuizSchema),
  submitQuiz,
);

export default router;
