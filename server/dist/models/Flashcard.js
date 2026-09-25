import mongoose, { Schema } from "mongoose";
const flashcardSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    spaceId: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const Flashcard = mongoose.model('Flashcard', flashcardSchema);
export default Flashcard;
