import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { 
    getNotesByUserId, 
    getNoteByIdAndUserId, 
    createNewNote, 
    deleteNoteById, 
    updateNoteTitle 
} from "../services/content/notes/management.js";
import { generateChatResponse } from "../services/content/notes/intelligence.js";

export const getNotes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const notes = await getNotesByUserId(req.userId as string);
    res.status(200).json({notes});
});

export const getNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const note = await getNoteByIdAndUserId(req.params.id as string, req.userId as string);
    res.status(200).json({ note });
});

export const createNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const note = await createNewNote(req.userId as string);
    res.status(200).json({ note });
});

export const deleteNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await deleteNoteById(req.params.id as string, req.userId as string);
    res.status(200).json({ message: "Note deleted" });
});

export const updateNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await updateNoteTitle(req.params.id as string, req.userId as string, req.body.title);
    res.status(200).json({ message: "Note updated" });
});

export const chat = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { history, message, noteId } = req.body;
    const response = await generateChatResponse(noteId, req.userId as string, message, history);
    res.status(200).json(response);
});
