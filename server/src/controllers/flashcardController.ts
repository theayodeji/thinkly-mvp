import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Note from "../models/Note.js";
import Flashcard from "../models/Flashcard.js";
import geminiService from "../utils/genai.js";
import { withMongoTransaction, isValidObjectId } from "../utils/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const generateFlashcards = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(noteId)) {
        throw new AppError("Invalid note ID", 400);
    }

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
        throw new AppError("Note not found", 404);
    }

    let createdFlashcards: any[] = [];
    await withMongoTransaction(async (session) => {
        const flashcardsData = await geminiService.generateFlashcards(note.content);
        
        // Create flashcard documents
        createdFlashcards = await Flashcard.insertMany(
            flashcardsData.map(card => ({
                question: card.question,
                answer: card.answer,
                noteId: note._id,
                userId
            })),
            { session }
        );

        // Update note with reference to the flashcards
        note.flashcards = createdFlashcards.map(f => f._id as Types.ObjectId);
        await note.save({ session });
    });

    res.status(201).json({ flashcards: createdFlashcards });
});

export const getFlashcards = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(noteId)) {
        throw new AppError("Invalid note ID", 400);
    }

    const flashcards = await Flashcard.find({ noteId, userId });
    res.json({ flashcards });
});

export const deleteFlashcards = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(noteId)) {
        throw new AppError("Invalid note ID", 400);
    }

    await withMongoTransaction(async (session) => {
        await Flashcard.deleteMany({ noteId, userId }).session(session);
        
        // Remove flashcards reference from note ensuring ownership
        await Note.findOneAndUpdate(
            { _id: noteId, userId }, 
            { $set: { flashcards: [] } }
        ).session(session);
    });
    
    res.json({ message: "Flashcards deleted successfully" });
});
