import type { Request, Response } from "express";
import { Types } from "mongoose";
import NoteModel from "../models/Note.js";
import Quiz from "../models/Quiz.js";
import geminiService from "../utils/genai.js";
import { withMongoTransaction, isValidObjectId } from "../utils/db.js";

export const generateQuiz = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const userId = req.userId;

  if (!isValidObjectId(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
  }

  const note = await NoteModel.findOne({ _id: noteId, userId });
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
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
};

export const getQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const userId = req.userId;

  if (!isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
  }

  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }
  res.status(200).json(quiz);
};

export const submitQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const userId = req.userId;
  let score: number = 0;

  if (!isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
  }

  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  req.body.answers.forEach((answer: number | null, index: number) => {
    if (answer === quiz.questions[index].correctAnswer) {
      score++;
    }
  });

  res.status(200).json({ score, answers: quiz.questions });
};
