import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  generateExplainer,
  getExplainersForSpace,
  getExplainer,
  deleteExplainer,
  retryExplainer,
} from "../controllers/explainerController.js";
import { paramsSpaceIdSchema, generateExplainerSchema, FeatureFlag } from "@thinkly/shared";
import { checkDailyAIActionsLimit } from "../middleware/usageLimit.js";

const router = Router();

router.use(authenticateJWT);

router.post(
  "/space/:spaceId",
  checkDailyAIActionsLimit(FeatureFlag.GENERATE_AUDIO),
  validateRequest(paramsSpaceIdSchema),
  validateRequest(generateExplainerSchema),
  generateExplainer
);

router.get(
  "/space/:spaceId",
  validateRequest(paramsSpaceIdSchema),
  getExplainersForSpace
);

router.get("/:id", getExplainer);
router.delete("/:id", deleteExplainer);
router.post("/:id/retry", retryExplainer);

export default router;
