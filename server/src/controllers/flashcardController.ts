import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Note from "../models/Note.js";
import Flashcard from "../models/Flashcard.js";
import geminiService from "../utils/genai.js";

export const generateFlashcards = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const userId = req.userId as Types.ObjectId;

    try {
        const note = await Note.findOne({ _id: noteId, userId });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const flashcardsData = await geminiService.generateFlashcards(note.content);
            
            // Create flashcard documents
            const flashcards = await Flashcard.insertMany(
                flashcardsData.map(card => ({
                    question: card.question,
                    answer: card.answer,
                    noteId: note._id,
                    userId
                })),
                { session }
            );

            // Update note with reference to the flashcards
            note.flashcards = flashcards.map(f => f._id);
            await note.save({ session });
            
            await session.commitTransaction();
            session.endSession();

            res.status(201).json({ flashcards });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error: any) {
        console.error("Generate flashcards error:", error);
        res.status(500).json({ message: "Failed to generate flashcards" });
    }
};

export const getFlashcards = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const userId = req.userId as Types.ObjectId;

    try {
        const flashcards = await Flashcard.find({ noteId, userId });
        res.json({ flashcards });
    } catch (error) {
        console.error("Get flashcards error:", error);
        res.status(500).json({ message: "Failed to fetch flashcards" });
    }
};

export const deleteFlashcards = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const userId = req.userId as Types.ObjectId;

    try {
        await Flashcard.deleteMany({ noteId, userId });
        
        // Remove flashcards reference from note
        await Note.findByIdAndUpdate(noteId, { $set: { flashcards: [] } });
        
        res.json({ message: "Flashcards deleted successfully" });
    } catch (error) {
        console.error("Delete flashcards error:", error);
        res.status(500).json({ message: "Failed to delete flashcards" });
    }
};
