import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { ISource, INote, SourceType } from "../types/entities.js";
import NoteModel from "../models/Note.js";
import SourceModel from "../models/Source.js";
import geminiService from "../utils/genai.js";
import { withMongoTransaction, isValidObjectId } from "../utils/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const addSource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const source: ISource = req.body;
  const userId = req.userId;

  if (!source.noteId || !isValidObjectId(source.noteId as unknown as string)) {
    throw new AppError("Valid Note ID is required", 400);
  }
if (!source.type) {
    throw new AppError("Source type is required", 400);
  }
  if (source.type === SourceType.TEXT && !source.text) {
    throw new AppError("Source text is required", 400);
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
      throw new AppError("Note not found", 404);
    }

    // Create the source first
    newSource = new SourceModel({
      ...source,
      status: source.type === SourceType.TEXT ? "parsed" : "parsing", // Set initial status
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
});

export const deleteSource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!isValidObjectId(id)) {
    throw new AppError("Invalid source ID", 400);
  }

  await withMongoTransaction(async (session) => {
    const note = await NoteModel.findOne({
      userId,
      sources: id,
    }).session(session);

    if (!note) {
      throw new AppError("Source not found in your notes", 404);
    }

    // Prevent deleting the only source
    if (note.sources.length === 1) {
      throw new AppError("Cannot delete the only source in a note", 403);
    }

    await SourceModel.findByIdAndDelete(id).session(session);
    await NoteModel.updateOne(
      { _id: note._id },
      { $pull: { sources: id } }
    ).session(session);
  });

  res.status(200).json({ message: "Source deleted successfully" });
});
