import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { generateFlashcards, getFlashcards, deleteFlashcards } from "../controllers/flashcardController.js";

const router = express.Router();

// Generate flashcards for a note
router.post("/:noteId/generate", authenticateJWT, generateFlashcards);

// Get all flashcards for a note
router.get("/:noteId", authenticateJWT, getFlashcards);

// Delete all flashcards for a note
router.delete("/:noteId", authenticateJWT, deleteFlashcards);

export default router;
