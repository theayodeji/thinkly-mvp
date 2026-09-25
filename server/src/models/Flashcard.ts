import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFlashcard {
  question: string;
  answer: string;
  spaceId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const flashcardSchema = new Schema<IFlashcard>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    spaceId: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Flashcard = mongoose.model<IFlashcard>('Flashcard', flashcardSchema);

export default Flashcard;
