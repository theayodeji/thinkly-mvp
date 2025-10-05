import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { generateQuiz, getQuiz, submitQuiz } from "../controllers/quizController.js";

const router = express.Router();

router.get("/:noteId/generate", authenticateJWT, generateQuiz);
router.get("/:quizId", authenticateJWT, getQuiz);
router.post("/:quizId/submit", authenticateJWT, submitQuiz);

export default router;
