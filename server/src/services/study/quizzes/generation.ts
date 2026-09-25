import SpaceModel from "../../../models/Space.js";
import SourceModel from "../../../models/Source.js";
import Quiz from "../../../models/Quiz.js";
import geminiService from "../../../utils/genai.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";

export const generateAndSaveQuiz = async (spaceId: string, userId: string) => {
  const space = await SpaceModel.findOne({ _id: spaceId, userId });
  if (!space) {
    throw new AppError("Space not found", 404);
  }
  
  const sources = await SourceModel.find({ spaceId });
  const sourcesContext = sources.map(s => s.text).join('\n\n');

  let savedQuiz: any = null;
  await withMongoTransaction(async (session) => {
    const questions = await geminiService.generateQuiz("Space Content: " + space.content + "\n\nSources:\n" + sourcesContext);
    const quiz = new Quiz({
      userId,
      spaceId: space._id,
      questions,
    });

    savedQuiz = await quiz.save({ session });
  });

  return savedQuiz;
};
