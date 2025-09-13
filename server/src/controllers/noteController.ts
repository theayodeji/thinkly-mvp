import type { Request, Response } from "express";
import NoteModel from "../models/Note.js";
import { Types } from "mongoose";
import geminiService from "../utils/genai.js";

export const getNotes = async (req: Request, res: Response) => {
    const userId = req.userId as Types.ObjectId;
    try {
        const notes = await NoteModel.find({ userId });
        res.status(200).json({notes});
    } catch (error: any) {
        console.error("Get notes error:", error);
        res.status(500).json({ message: "Failed to get notes" });
    }
};

export const getNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId as Types.ObjectId;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    try {
        const note = await NoteModel.findById(id).populate("sources");
        res.status(200).json({ note });
    } catch (error: any) {
        console.error("Get note error:", error);
        res.status(500).json({ message: "Failed to get note" });
    }
}

export const createNote = async (req: Request, res: Response) => {
    const userId = req.userId as Types.ObjectId;
    try {
        const note = new NoteModel({
            userId,
            title: `Untitled Note ${Date.now().toString().slice(-5)}`,
        });
        await note.save();
        res.status(200).json({ note });
    } catch (error: any) {
        console.error("Create note error:", error);
        res.status(500).json({ message: "Failed to create note" });
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId as Types.ObjectId;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    try {
        await NoteModel.findByIdAndDelete(id, { userId });
        res.status(200).json({ message: "Note deleted" });
    } catch (error: any) {
        console.error("Delete note error:", error);
        res.status(500).json({ message: "Failed to delete note" });
    }
};

// rename only
export const updateNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    // const userId = req.userId as Types.ObjectId;
    if (!req.body.title) {
        return res.status(400).json({ message: "Title is required" });
    }
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    try {
        await NoteModel.findByIdAndUpdate(id, { title: req.body.title });
        res.status(200).json({ message: "Note updated" });
    } catch (error: any) {
        console.error("Update note error:", error);
        res.status(500).json({ message: "Failed to update note" });
    }
};

export const chat = async(req: Request, res: Response) => {
    const { history, noteId } = req.body;
    const userId = req.userId as Types.ObjectId;

    if (!Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ message: "Invalid note ID" });
    }
    try {
        const note = await NoteModel.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        const result = await geminiService.generateChat("Content: " + note.content + "\n\n" + "History: " + JSON.stringify(history));
        res.status(200).json(JSON.parse(result));
        
    } catch (error: any) {
        console.error("Chat error:", error);
        res.status(500).json({ message: "Failed to chat" });
    }
}



