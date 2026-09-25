import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { generateFlashcards, getFlashcards, deleteFlashcards } from "../controllers/flashcardController.js";

import { validateRequest } from "../middleware/validate.js";
import { paramsSpaceIdSchema } from "@thinkly/shared";

const router = express.Router();

// Generate flashcards for a note
router.post("/:spaceId/generate", authenticateJWT, validateRequest(paramsSpaceIdSchema), generateFlashcards);

// Get all flashcards for a note
router.get("/:spaceId", authenticateJWT, validateRequest(paramsSpaceIdSchema), getFlashcards);

// Delete all flashcards for a note
router.delete("/:spaceId", authenticateJWT, validateRequest(paramsSpaceIdSchema), deleteFlashcards);

export default router;
