import { z } from "zod";
import { SourceType } from "./types.js";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const paramsIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const paramsSpaceIdSchema = z.object({
  params: z.object({
    spaceId: objectIdSchema,
  }),
});

export const paramsQuizIdSchema = z.object({
  params: z.object({
    quizId: objectIdSchema,
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const updateSpaceSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    title: z.string().min(1, "Title is required"),
  }),
});

export const addSourceSchema = z.object({
  body: z
    .object({
      spaceId: objectIdSchema,
      type: z.nativeEnum(SourceType),
      text: z.string().optional(),
      name: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.type === SourceType.TEXT && !data.text) {
          return false;
        }
        return true;
      },
      {
        message: `Text is required when type is '${SourceType.TEXT}'`,
        path: ["text"],
      },
    ),
});

export const submitQuizSchema = z.object({
  params: z.object({
    quizId: objectIdSchema,
  }),
  body: z.object({
    answers: z.array(z.number().nullable()),
  }),
});

export const chatSchema = z.object({
  body: z.object({
    spaceId: objectIdSchema,
    message: z.string().min(1, "Message is required"),
    history: z.array(z.any()).optional(),
  }),
});

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
    spaceId: z.string(),
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
    spaceId: z.string(),
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
    spaceId: z.string(),
    questions: z.array(QuizQuestionSchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .passthrough();

export const SpaceSchema = z
  .object({
    _id: z.string(),
    title: z.string().nullish().transform(v => v || "Untitled Space"),
    content: z.string().nullish().transform(v => v || ""),
    userId: z.string(),
    summary: z.string().nullish().transform(v => v || ""),
    sourcesCount: z.number().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .passthrough();

export const SpacePreviewSchema = SpaceSchema.pick({
  _id: true,
  title: true,
  createdAt: true,
});

export const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.coerce.date(),
});

export const ChatSchema = z.object({
  _id: z.string(),
  spaceId: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  messages: z.array(MessageSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
