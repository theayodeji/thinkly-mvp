import type { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import type { ISource, INote } from "../types/entities.js";
import NoteModel from "../models/Note.js";
import SourceModel from "../models/Source.js";
import geminiService from "../utils/genai.js";

//All handlers require authentication middleware to run and return userId

export const addSource = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const source: ISource = req.body;

    if (!source.noteId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Note ID is required" });
    }
    if (!source.type) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Source type is required" });
    }
    if (source.type === "text" && !source.text) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Source text is required" });
    }

    const { title } = await geminiService.generateTitle(source.text || "");
    const { summary } = await geminiService.generateSummary(source.text || "");
    source.name = source.name || title;

    // Find the note and lock it for update
    const note = (await NoteModel.findById(source.noteId).session(
      session
    )) as INote;
    if (!note) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Note not found" });
    }

    // Create the source first
    const newSource = new SourceModel({
      ...source,
      status: source.type === "text" ? "parsed" : "parsing", // Set initial status
    });
    await newSource.save({ session });

    // Update the note with the new source
    note.sources.push(newSource._id as Types.ObjectId);
    note.content = (note.content || "") + "\n" + source.text;

    // Generate title if this is the first source
    if (note.sources.length === 1) {
      note.title = title;
      note.summary = summary;
    }
    await note.save({ session });
    await session.commitTransaction();

    res.status(201).json({ source: newSource });
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Add source error:", error);
    res.status(500).json({
      message: "Failed to add source",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};

export const deleteSource = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.userId as Types.ObjectId;

    if (!Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid source ID" });
    }

    const note = await NoteModel.findOne({
      userId,
      sources: new Types.ObjectId(id),
    }).session(session);

    if (!note) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ message: "Source not found in your notes" });
    }

    // Prevent deleting the only source
    if (note.sources.length === 1) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: "Cannot delete the only source in a note" });
    }

    await SourceModel.findByIdAndDelete(id).session(session);
    await NoteModel.updateOne(
      { _id: note._id },
      { $pull: { sources: id } }
    ).session(session);

    await session.commitTransaction();
    res.status(200).json({ message: "Source deleted successfully" });
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Delete source error:", error);
    res.status(500).json({
      message: "Failed to delete source",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};

