import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { generateFlashcards, getFlashcards, deleteFlashcards } from "../controllers/flashcardController.js";
import { validateRequest } from "../middleware/validate.js";
import { paramsSpaceIdSchema } from "@thinkly/shared";
import { aiLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();
// Generate flashcards for a note
router.post("/:spaceId/generate", authenticateJWT, aiLimiter, validateRequest(paramsSpaceIdSchema), generateFlashcards);
// Get all flashcards for a note
router.get("/:spaceId", authenticateJWT, validateRequest(paramsSpaceIdSchema), getFlashcards);
// Delete all flashcards for a note
router.delete("/:spaceId", authenticateJWT, validateRequest(paramsSpaceIdSchema), deleteFlashcards);
export default router;
