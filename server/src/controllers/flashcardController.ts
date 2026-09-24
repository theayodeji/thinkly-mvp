import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { generateAndSaveFlashcards } from "../services/study/flashcards/generation.js";
import { getFlashcardsByNoteId, deleteFlashcardsTransaction } from "../services/study/flashcards/management.js";

export const generateFlashcards = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const createdFlashcards = await generateAndSaveFlashcards(req.params.noteId as string, req.userId as string);
    res.status(201).json({ flashcards: createdFlashcards });
});

export const getFlashcards = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const flashcards = await getFlashcardsByNoteId(req.params.noteId as string, req.userId as string);
    res.json({ flashcards });
});

export const deleteFlashcards = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await deleteFlashcardsTransaction(req.params.noteId as string, req.userId as string);
    res.json({ message: "Flashcards deleted successfully" });
});
