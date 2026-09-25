import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { generateAndSaveQuiz } from "../services/study/quizzes/generation.js";
import { getQuizByIdAndUserId, getQuizBySpaceIdAndUserId, evaluateQuizSubmission } from "../services/study/quizzes/evaluation.js";

export const generateQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const savedQuiz = await generateAndSaveQuiz(req.params.spaceId as string, req.userId as string);
  res.status(201).json({ quiz: savedQuiz });
});

export const getQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const quiz = await getQuizBySpaceIdAndUserId(req.params.spaceId as string, req.userId as string);
  res.status(200).json(quiz);
});

export const submitQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await evaluateQuizSubmission(req.params.quizId as string, req.userId as string, req.body.answers);
  res.status(200).json(result);
});
