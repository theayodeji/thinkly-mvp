import Quiz from "../../../models/Quiz.js";
import { AppError } from "../../../utils/AppError.js";
export const getQuizByIdAndUserId = async (quizId, userId) => {
    const quiz = await Quiz.findOne({ _id: quizId, userId });
    if (!quiz) {
        throw new AppError("Quiz not found", 404);
    }
    return quiz;
};
export const getQuizBySpaceIdAndUserId = async (spaceId, userId) => {
    const quiz = await Quiz.findOne({ spaceId, userId }).sort({ createdAt: -1 });
    if (!quiz) {
        throw new AppError("Quiz not found", 404);
    }
    return quiz;
};
export const evaluateQuizSubmission = async (quizId, userId, answers) => {
    const quiz = await Quiz.findOne({ _id: quizId, userId });
    if (!quiz) {
        throw new AppError("Quiz not found", 404);
    }
    let score = 0;
    answers.forEach((answer, index) => {
        if (answer === quiz.questions[index].correctAnswer) {
            score++;
        }
    });
    return { score, answers: quiz.questions };
};
