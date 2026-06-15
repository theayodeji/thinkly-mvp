import type { Request, Response } from "express";
import { Types } from "mongoose";
import type { ISource, INote } from "../types/entities.js";
import NoteModel from "../models/Note.js";
import SourceModel from "../models/Source.js";
import geminiService from "../utils/genai.js";
import { withMongoTransaction, isValidObjectId } from "../utils/db.js";

export const addSource = async (req: Request, res: Response) => {
  const source: ISource = req.body;
  const userId = req.userId;

  if (!source.noteId || !isValidObjectId(source.noteId as unknown as string)) {
    return res.status(400).json({ message: "Valid Note ID is required" });
  }
  if (!source.type) {
    return res.status(400).json({ message: "Source type is required" });
  }
  if (source.type === "text" && !source.text) {
    return res.status(400).json({ message: "Source text is required" });
  }

  const { title } = await geminiService.generateTitle(source.text || "");
  const { summary } = await geminiService.generateSummary(source.text || "");
  const { questions } = await geminiService.generateChatSuggestions(source.text || "");
  source.name = source.name || title;

  let newSource: any = null;

  await withMongoTransaction(async (session) => {
    // Find the note and lock it for update
    const note = await NoteModel.findOne({ _id: source.noteId, userId }).session(session);
    
    if (!note) {
      const error: any = new Error("Note not found");
      error.status = 404;
      throw error;
    }

    // Create the source first
    newSource = new SourceModel({
      ...source,
      status: source.type === "text" ? "parsed" : "parsing", // Set initial status
    });
    await newSource.save({ session });

    // Update the note with the new source
    note.sources.push(newSource._id as Types.ObjectId);
    note.content = (note.content || "") + "\n" + source.text;
    note.chatSuggestions = [...(note.chatSuggestions || []), ...questions];

    // Generate title if this is the first source
    if (note.sources.length === 1) {
      note.title = title;
      note.summary = summary;
    }
    await note.save({ session }); 
  });

  res.status(201).json({ source: newSource });
};

export const deleteSource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid source ID" });
  }

  await withMongoTransaction(async (session) => {
    const note = await NoteModel.findOne({
      userId,
      sources: id,
    }).session(session);

    if (!note) {
      const error: any = new Error("Source not found in your notes");
      error.status = 404;
      throw error;
    }

    // Prevent deleting the only source
    if (note.sources.length === 1) {
      const error: any = new Error("Cannot delete the only source in a note");
      error.status = 403;
      throw error;
    }

    await SourceModel.findByIdAndDelete(id).session(session);
    await NoteModel.updateOne(
      { _id: note._id },
      { $pull: { sources: id } }
    ).session(session);
  });

  res.status(200).json({ message: "Source deleted successfully" });
};
