import { catchAsync } from "../utils/catchAsync.js";
import { generateAndSaveFlashcards } from "../services/study/flashcards/generation.js";
import { getFlashcardsByspaceId, deleteFlashcardsTransaction } from "../services/study/flashcards/management.js";
export const generateFlashcards = catchAsync(async (req, res, next) => {
    const createdFlashcards = await generateAndSaveFlashcards(req.params.spaceId, req.userId);
    res.status(201).json({ flashcards: createdFlashcards });
});
export const getFlashcards = catchAsync(async (req, res, next) => {
    const flashcards = await getFlashcardsByspaceId(req.params.spaceId, req.userId);
    res.json({ flashcards });
});
export const deleteFlashcards = catchAsync(async (req, res, next) => {
    await deleteFlashcardsTransaction(req.params.spaceId, req.userId);
    res.json({ message: "Flashcards deleted successfully" });
});
