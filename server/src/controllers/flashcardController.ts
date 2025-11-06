import { Request, Response } from "express";
import Note from "src/models/Note";
import geminiService from "src/utils/genai";

export const generateFlashcards = async (req: Request, res:Response) => {
    const { noteId } = req.body;

    const note = await Note.findById({noteId});
    if (!note) {
        return res.status(404).json({ error: "Note not found" });
    }

  try {
    const flashcards = await geminiService.generateFlashcards(note.content);

    

  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};
