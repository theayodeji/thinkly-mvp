import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import NoteModel from "../models/Note.js";
import Quiz from "../models/Quiz.js";
import geminiService from "../utils/genai.js";
import { withMongoTransaction, isValidObjectId } from "../utils/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const generateQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { noteId } = req.params;
  const userId = req.userId;

  if (!isValidObjectId(noteId)) {
      throw new AppError("Invalid note ID", 400);
  }

  const note = await NoteModel.findOne({ _id: noteId, userId });
  if (!note) {
    throw new AppError("Note not found", 404);
  }
  
  let savedQuiz: any = null;
  await withMongoTransaction(async (session) => {
    const questions = await geminiService.generateQuiz(note.content);
    const quiz = new Quiz({
      userId,
      noteId: note._id,
      questions,
    });

    savedQuiz = await quiz.save({ session });

    note.quiz = savedQuiz._id as Types.ObjectId;
    await note.save({ session });
  });

  res.status(201).json({ quiz: savedQuiz });
});

export const getQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { quizId } = req.params;
  const userId = req.userId;

  if (!isValidObjectId(quizId)) {
      throw new AppError("Invalid quiz ID", 400);
  }

  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  res.status(200).json(quiz);
});

export const submitQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { quizId } = req.params;
  const userId = req.userId;
  let score: number = 0;

  if (!isValidObjectId(quizId)) {
      throw new AppError("Invalid quiz ID", 400);
  }

  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  req.body.answers.forEach((answer: number | null, index: number) => {
    if (answer === quiz.questions[index].correctAnswer) {
      score++;
    }
  });

  res.status(200).json({ score, answers: quiz.questions });
});
