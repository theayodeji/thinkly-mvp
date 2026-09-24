import Note from "../../../models/Note.js";
import Flashcard from "../../../models/Flashcard.js";
import geminiService from "../../../utils/genai.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";

export const generateAndSaveFlashcards = async (noteId: string, userId: string) => {
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
        note.flashcards = createdFlashcards.map(f => String(f._id));
        await note.save({ session });
    });

    return createdFlashcards;
};
