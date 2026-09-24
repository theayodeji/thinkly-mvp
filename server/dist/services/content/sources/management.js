import NoteModel from "../../../models/Note.js";
import SourceModel from "../../../models/Source.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";
export const deleteSourceTransaction = async (id, userId) => {
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
        await NoteModel.updateOne({ _id: note._id }, { $pull: { sources: id } }).session(session);
    });
};
