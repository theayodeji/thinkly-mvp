import Quiz from "../../../models/Quiz.js";
import { AppError } from "../../../utils/AppError.js";

export const getQuizByIdAndUserId = async (quizId: string, userId: string) => {
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  return quiz;
};

export const evaluateQuizSubmission = async (quizId: string, userId: string, answers: (number | null)[]) => {
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  let score: number = 0;
  answers.forEach((answer: number | null, index: number) => {
    if (answer === quiz.questions[index].correctAnswer) {
      score++;
    }
  });

  return { score, answers: quiz.questions };
};
