import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { generateFlashcards, getFlashcards, deleteFlashcards } from "../controllers/flashcardController.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = express.Router();

// Generate flashcards for a note
router.post("/:noteId/generate", authenticateJWT, catchAsync(generateFlashcards));

// Get all flashcards for a note
router.get("/:noteId", authenticateJWT, catchAsync(getFlashcards));

// Delete all flashcards for a note
router.delete("/:noteId", authenticateJWT, catchAsync(deleteFlashcards));

export default router;
