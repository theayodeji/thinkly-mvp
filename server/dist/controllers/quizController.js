import { catchAsync } from "../utils/catchAsync.js";
import { generateAndSaveQuiz } from "../services/study/quizzes/generation.js";
import { getQuizByIdAndUserId, evaluateQuizSubmission } from "../services/study/quizzes/evaluation.js";
export const generateQuiz = catchAsync(async (req, res, next) => {
    const savedQuiz = await generateAndSaveQuiz(req.params.noteId, req.userId);
    res.status(201).json({ quiz: savedQuiz });
});
export const getQuiz = catchAsync(async (req, res, next) => {
    const quiz = await getQuizByIdAndUserId(req.params.quizId, req.userId);
    res.status(200).json(quiz);
});
export const submitQuiz = catchAsync(async (req, res, next) => {
    const result = await evaluateQuizSubmission(req.params.quizId, req.userId, req.body.answers);
    res.status(200).json(result);
});
