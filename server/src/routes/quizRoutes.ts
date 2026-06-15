import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { generateQuiz, getQuiz, submitQuiz } from "../controllers/quizController.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validateRequest } from "../middleware/validate.js";
import { submitQuizSchema } from "../schemas/index.js";

const router = express.Router();

router.get("/:noteId/generate", authenticateJWT, catchAsync(generateQuiz));
router.get("/:quizId", authenticateJWT, catchAsync(getQuiz));
router.post("/:quizId/submit", authenticateJWT, validateRequest(submitQuizSchema), catchAsync(submitQuiz));

export default router;
