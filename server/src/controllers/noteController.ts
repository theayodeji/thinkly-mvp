import type { Request, Response } from "express";
import NoteModel from "../models/Note.js";
import { Types } from "mongoose";
import geminiService from "../utils/genai.js";
import SourceModel from "../models/Source.js";
import { withMongoTransaction, isValidObjectId } from "../utils/db.js";

export const getNotes = async (req: Request, res: Response) => {
    const userId = req.userId;
    const notes = await NoteModel.find({ userId });
    res.status(200).json({notes});
};

export const getNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    const note = await NoteModel.findOne({ _id: id, userId }).populate("sources");
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ note });
}

export const createNote = async (req: Request, res: Response) => {
    const userId = req.userId;
    const note = new NoteModel({
        userId,
        title: `Untitled Note ${Date.now().toString().slice(-5)}`,
    });
    await note.save();
    res.status(200).json({ note });
};

export const deleteNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    
    await withMongoTransaction(async (session) => {
        const note = await NoteModel.findOneAndDelete({ _id: id, userId }).session(session);
        if (!note) {
            const error: any = new Error("Note not found");
            error.status = 404;
            throw error;
        }
        await SourceModel.deleteMany({ noteId: id }).session(session);
    });
    res.status(200).json({ message: "Note deleted" });
};

export const updateNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!req.body.title) {
        return res.status(400).json({ message: "Title is required" });
    }
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    const note = await NoteModel.findOneAndUpdate({ _id: id, userId }, { title: req.body.title });
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note updated" });
};

export const chat = async(req: Request, res: Response) => {
    const { history, noteId } = req.body;
    const userId = req.userId;

    if (!isValidObjectId(noteId)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    const note = await NoteModel.findOne({ _id: noteId, userId });
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    const resultStr = await geminiService.generateChat("Content: " + note.content + "\n\n" + "History: " + JSON.stringify(history));
    res.status(200).json(JSON.parse(resultStr));
}