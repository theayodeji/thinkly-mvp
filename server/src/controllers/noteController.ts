import type { Request, Response, NextFunction } from "express";
import NoteModel from "../models/Note.js";
import { Types } from "mongoose";
import geminiService from "../utils/genai.js";
import SourceModel from "../models/Source.js";
import { withMongoTransaction, isValidObjectId } from "../utils/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getNotes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const notes = await NoteModel.find({ userId });
    res.status(200).json({notes});
});

export const getNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
        throw new AppError("Invalid note ID", 400);
    }
    const note = await NoteModel.findOne({ _id: id, userId }).populate("sources");
    if (!note) {
        throw new AppError("Note not found", 404);
    }
    res.status(200).json({ note });
});

export const createNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const note = new NoteModel({
        userId,
        title: `Untitled Note ${Date.now().toString().slice(-5)}`,
    });
    await note.save();
    res.status(200).json({ note });
});

export const deleteNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!isValidObjectId(id)) {
        throw new AppError("Invalid note ID", 400);
    }
    
    await withMongoTransaction(async (session) => {
        const note = await NoteModel.findOneAndDelete({ _id: id, userId }).session(session);
        if (!note) {
            throw new AppError("Note not found", 404);
        }
        await SourceModel.deleteMany({ noteId: id }).session(session);
    });
    res.status(200).json({ message: "Note deleted" });
});

export const updateNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!req.body.title) {
        throw new AppError("Title is required", 400);
    }
    if (!isValidObjectId(id)) {
        throw new AppError("Invalid note ID", 400);
    }
    const note = await NoteModel.findOneAndUpdate({ _id: id, userId }, { title: req.body.title });
    if (!note) {
        throw new AppError("Note not found", 404);
    }
    res.status(200).json({ message: "Note updated" });
});

export const chat = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { history = [], message, noteId } = req.body;
    const userId = req.userId;

    if (!isValidObjectId(noteId)) {
        throw new AppError("Invalid note ID", 400);
    }
    const note = await NoteModel.findOne({ _id: noteId, userId });
    if (!note) {
        throw new AppError("Note not found", 404);
    }

    const fullHistory = [...history, { role: "user", content: message }];

    const resultStr = await geminiService.generateChat(
      "Content: " + note.content + "\n\n" + "History: " + JSON.stringify(fullHistory)
    );
    res.status(200).json(JSON.parse(resultStr));
});