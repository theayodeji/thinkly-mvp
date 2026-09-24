import NoteModel from "../../../models/Note.js";
import Quiz from "../../../models/Quiz.js";
import geminiService from "../../../utils/genai.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";
export const generateAndSaveQuiz = async (noteId, userId) => {
    const note = await NoteModel.findOne({ _id: noteId, userId });
    if (!note) {
        throw new AppError("Note not found", 404);
    }
    let savedQuiz = null;
    await withMongoTransaction(async (session) => {
        const questions = await geminiService.generateQuiz(note.content);
        const quiz = new Quiz({
            userId,
            noteId: note._id,
            questions,
        });
        savedQuiz = await quiz.save({ session });
        note.quiz = String(savedQuiz._id);
        await note.save({ session });
    });
    return savedQuiz;
};
