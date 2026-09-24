import Note from "../../../models/Note.js";
import Flashcard from "../../../models/Flashcard.js";
import { withMongoTransaction } from "../../../utils/db.js";

export const getFlashcardsByNoteId = async (noteId: string, userId: string) => {
    return await Flashcard.find({ noteId, userId });
};

export const deleteFlashcardsTransaction = async (noteId: string, userId: string) => {
    await withMongoTransaction(async (session) => {
        await Flashcard.deleteMany({ noteId, userId }).session(session);
        
        // Remove flashcards reference from note ensuring ownership
        await Note.findOneAndUpdate(
            { _id: noteId, userId }, 
            { $set: { flashcards: [] } }
        ).session(session);
    });
};
