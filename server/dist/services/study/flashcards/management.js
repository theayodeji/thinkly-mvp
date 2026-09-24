import Note from "../../../models/Note.js";
import Flashcard from "../../../models/Flashcard.js";
import { withMongoTransaction } from "../../../utils/db.js";
export const getFlashcardsByNoteId = async (noteId, userId) => {
    return await Flashcard.find({ noteId, userId });
};
export const deleteFlashcardsTransaction = async (noteId, userId) => {
    await withMongoTransaction(async (session) => {
        await Flashcard.deleteMany({ noteId, userId }).session(session);
        // Remove flashcards reference from note ensuring ownership
        await Note.findOneAndUpdate({ _id: noteId, userId }, { $set: { flashcards: [] } }).session(session);
    });
};
