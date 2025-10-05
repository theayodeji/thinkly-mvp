import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import NoteModel from "../models/Note.js";
import Quiz from "../models/Quiz.js";
import geminiService from "../utils/genai.js"; 

export const generateQuiz = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const userId = req.userId as Types.ObjectId;

    try {
        const note = await NoteModel.findOne({ _id: noteId, userId });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const questions = await geminiService.generateQuiz(note.content);
            const quiz = new Quiz({
                userId,
                noteId: note._id,
                questions
            });
            
            const savedQuiz = await quiz.save({ session });

            note.quiz = savedQuiz._id as Types.ObjectId;
            await note.save({ session });
            await session.commitTransaction();
            session.endSession();

            res.status(201).json({ quiz: savedQuiz });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error: any) {
        console.error("Generate quiz error:", error);
        res.status(500).json({ message: "Failed to generate quiz" });
    }
};

export const getQuiz = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const userId = req.userId as Types.ObjectId;

    try {
        const quiz = await Quiz.findOne({ _id: quizId, userId });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json( quiz );
    } catch (error: any) {
        console.error("Get quiz error:", error);
        res.status(500).json({ message: "Failed to get quiz" });
    }
};

export const submitQuiz = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    // const userId = req.userId as Types.ObjectId;
    let score:number = 0;

    try {
        const quiz = await Quiz.findOne({ _id: quizId });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        req.body.answers.forEach((answer:number | null, index:number) => {
            if (answer === quiz.questions[index].correctAnswer) {
                score++;
            }
        });
        
        res.status(200).json({ score });
    } catch (error: any) {
        console.error("Submit quiz error:", error);
        res.status(500).json({ message: "Failed to submit quiz" });
    }
};
