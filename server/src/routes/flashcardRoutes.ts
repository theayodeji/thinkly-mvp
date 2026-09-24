import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { generateFlashcards, getFlashcards, deleteFlashcards } from "../controllers/flashcardController.js";

import { validateRequest } from "../middleware/validate.js";
import { paramsNoteIdSchema } from "@thinkly/shared";

const router = express.Router();

// Generate flashcards for a note
router.post("/:noteId/generate", authenticateJWT, validateRequest(paramsNoteIdSchema), generateFlashcards);

// Get all flashcards for a note
router.get("/:noteId", authenticateJWT, validateRequest(paramsNoteIdSchema), getFlashcards);

// Delete all flashcards for a note
router.delete("/:noteId", authenticateJWT, validateRequest(paramsNoteIdSchema), deleteFlashcards);

export default router;
