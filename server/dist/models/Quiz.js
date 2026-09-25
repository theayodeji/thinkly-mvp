import mongoose from "mongoose";
const QuizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Space",
        required: true
    },
    questions: [{
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true },
            explanation: { type: String, required: true }
        }]
}, { timestamps: true });
export default mongoose.model("Quiz", QuizSchema);
