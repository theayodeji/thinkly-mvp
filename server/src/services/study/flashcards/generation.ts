import Space from "../../../models/Space.js";
import Source from "../../../models/Source.js";
import Flashcard from "../../../models/Flashcard.js";
import geminiService from "../../../utils/genai.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";

export const generateAndSaveFlashcards = async (spaceId: string, userId: string) => {
    const space = await Space.findOne({ _id: spaceId, userId });
    if (!space) {
        throw new AppError("Space not found", 404);
    }
    
    const sources = await Source.find({ spaceId });
    const sourcesContext = sources.map(s => s.text).join('\n\n');

    const contentContext = [
    space.content ? `Space Content: ${space.content}` : '',
    sourcesContext ? `Sources:\n${sourcesContext}` : ''
  ].filter(Boolean).join('\n\n');

  if (!contentContext) {
    throw new AppError("Cannot generate flashcards: No content or sources found in this space", 400);
  }

  let createdFlashcards: any[] = [];
  await withMongoTransaction(async (session) => {
        const flashcardsData = await geminiService.generateFlashcards(contentContext);
        
        // Create flashcard documents
        createdFlashcards = await Flashcard.insertMany(
            flashcardsData.map(card => ({
                question: card.question,
                answer: card.answer,
                spaceId: space._id,
                userId
            })),
            { session }
        );
    });

    return createdFlashcards;
};
