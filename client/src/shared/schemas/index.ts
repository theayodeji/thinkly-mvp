import { z } from "zod";
import { SourceType } from "../types/source";

export const UserSchema = z
  .object({
    id: z.string().optional(),
    _id: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().optional(),
    streaks: z
      .object({
        current: z.number().default(0),
        longest: z.number().default(0),
        lastActive: z.coerce.date().optional(),
      })
      .optional()
      .default({ current: 0, longest: 0 }),
    achievements: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          earnedAt: z.coerce.date(),
        }),
      )
      .optional()
      .default([]),
    badges: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          level: z.string(),
          earnedAt: z.coerce.date(),
        }),
      )
      .optional()
      .default([]),
  })
  .passthrough();

export const SourceSchema = z
  .object({
    _id: z.string(),
    type: z.nativeEnum(SourceType),
    file_url: z.string().optional(),
    name: z.string().optional(),
    text: z.string().optional(),
    noteId: z.string(),
    status: z.enum(["parsing", "parsed", "error"]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .passthrough();

export const FlashcardSchema = z
  .object({
    _id: z.string(),
    question: z.string(),
    answer: z.string(),
    noteId: z.string(),
    userId: z.string(),
    createdAt: z.string().or(z.coerce.date()).optional(),
    updatedAt: z.string().or(z.coerce.date()).optional(),
  })
  .passthrough();

export const QuizQuestionSchema = z
  .object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number(),
    explanation: z.string(),
  })
  .passthrough();

export const QuizSchema = z
  .object({
    _id: z.string(),
    userId: z.string(),
    noteId: z.string(),
    questions: z.array(QuizQuestionSchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .passthrough();

export const NoteSchema = z
  .object({
    _id: z.string(),
    title: z.string().nullish().transform(v => v || "Untitled Note"),
    content: z.string().nullish().transform(v => v || ""),
    sources: z.array(z.string().or(SourceSchema)).nullish().transform(v => v || []),
    userId: z.string(),
    summary: z.string().nullish().transform(v => v || ""),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    quiz: z.string().optional(),
    chatSuggestions: z.array(z.string()).optional(),
    flashcards: z.array(z.string().or(FlashcardSchema)).optional(),
  })
  .passthrough();

export const NotePreviewSchema = NoteSchema.pick({
  _id: true,
  title: true,
  sources: true,
  createdAt: true,
});
