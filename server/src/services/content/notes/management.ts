import NoteModel from "../../../models/Note.js";
import SourceModel from "../../../models/Source.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";

export const getNotesByUserId = async (userId: string) => {
    return await NoteModel.find({ userId });
};

export const getNoteByIdAndUserId = async (id: string, userId: string) => {
    const note = await NoteModel.findOne({ _id: id, userId }).populate("sources");
    if (!note) {
        throw new AppError("Note not found", 404);
    }
    return note;
};

export const createNewNote = async (userId: string) => {
    const note = new NoteModel({
        userId,
        title: `Untitled Note ${Date.now().toString().slice(-5)}`,
    });
    return await note.save();
};

export const deleteNoteById = async (id: string, userId: string) => {
    await withMongoTransaction(async (session) => {
        const note = await NoteModel.findOneAndDelete({ _id: id, userId }).session(session);
        if (!note) {
            throw new AppError("Note not found", 404);
        }
        await SourceModel.deleteMany({ noteId: id }).session(session);
    });
};

export const updateNoteTitle = async (id: string, userId: string, title: string) => {
    const note = await NoteModel.findOneAndUpdate({ _id: id, userId }, { title });
    if (!note) {
        throw new AppError("Note not found", 404);
    }
    return note;
};
