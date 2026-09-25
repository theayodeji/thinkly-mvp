import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import {
  generateQuiz,
  getQuiz,
  submitQuiz,
} from "../controllers/quizController.js";
import { validateRequest } from "../middleware/validate.js";
import { submitQuizSchema, paramsSpaceIdSchema, paramsQuizIdSchema } from "@thinkly/shared";

const router = express.Router();

router.get("/:spaceId/generate", authenticateJWT, validateRequest(paramsSpaceIdSchema), generateQuiz);
router.get("/:spaceId", authenticateJWT, validateRequest(paramsSpaceIdSchema), getQuiz);
router.post(
  "/:quizId/submit",
  authenticateJWT,
  validateRequest(submitQuizSchema),
  submitQuiz,
);

export default router;
