import { catchAsync } from "../utils/catchAsync.js";
import { generateAndSaveFlashcards } from "../services/study/flashcards/generation.js";
import { getFlashcardsByNoteId, deleteFlashcardsTransaction } from "../services/study/flashcards/management.js";
export const generateFlashcards = catchAsync(async (req, res, next) => {
    const createdFlashcards = await generateAndSaveFlashcards(req.params.noteId, req.userId);
    res.status(201).json({ flashcards: createdFlashcards });
});
export const getFlashcards = catchAsync(async (req, res, next) => {
    const flashcards = await getFlashcardsByNoteId(req.params.noteId, req.userId);
    res.json({ flashcards });
});
export const deleteFlashcards = catchAsync(async (req, res, next) => {
    await deleteFlashcardsTransaction(req.params.noteId, req.userId);
    res.json({ message: "Flashcards deleted successfully" });
});
