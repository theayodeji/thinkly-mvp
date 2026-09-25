import Flashcard from "../../../models/Flashcard.js";
import { withMongoTransaction } from "../../../utils/db.js";
export const getFlashcardsByspaceId = async (spaceId, userId) => {
    return await Flashcard.find({ spaceId, userId });
};
export const deleteFlashcardsTransaction = async (spaceId, userId) => {
    await withMongoTransaction(async (session) => {
        await Flashcard.deleteMany({ spaceId, userId }).session(session);
        // Note: Space schema no longer has flashcards array, so no update needed on Space
    });
};
