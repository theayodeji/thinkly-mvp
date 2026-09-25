import Space from "../../../models/Space.js";
import Flashcard from "../../../models/Flashcard.js";
import { withMongoTransaction } from "../../../utils/db.js";

export const getFlashcardsByspaceId = async (spaceId: string, userId: string) => {
    return await Flashcard.find({ spaceId, userId });
};

export const deleteFlashcardsTransaction = async (spaceId: string, userId: string) => {
    await withMongoTransaction(async (session) => {
        await Flashcard.deleteMany({ spaceId, userId }).session(session);
        // Note: Space schema no longer has flashcards array, so no update needed on Space
    });
};
