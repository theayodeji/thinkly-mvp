import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  generateExplainer,
  getExplainersForSpace,
  getExplainer,
  deleteExplainer,
} from "../controllers/explainerController.js";
import { paramsSpaceIdSchema, generateExplainerSchema } from "@thinkly/shared";

const router = Router();

router.use(authenticateJWT);

router.post(
  "/space/:spaceId",
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

export default router;
