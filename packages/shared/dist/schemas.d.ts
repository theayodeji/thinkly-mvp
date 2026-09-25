import { z } from "zod";
import { SourceType } from "./types.js";
export declare const objectIdSchema: z.ZodString;
export declare const paramsIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const paramsSpaceIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        spaceId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const paramsQuizIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        quizId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateSpaceSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        title: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const addSourceSchema: z.ZodObject<{
    body: z.ZodObject<{
        spaceId: z.ZodString;
        type: z.ZodEnum<typeof SourceType>;
        text: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const submitQuizSchema: z.ZodObject<{
    params: z.ZodObject<{
        quizId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        answers: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const chatSchema: z.ZodObject<{
    body: z.ZodObject<{
        spaceId: z.ZodString;
        message: z.ZodString;
        history: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    _id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    streaks: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        current: z.ZodDefault<z.ZodNumber>;
        longest: z.ZodDefault<z.ZodNumber>;
        lastActive: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$strip>>>;
    achievements: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        icon: z.ZodString;
        earnedAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>>>;
    badges: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        level: z.ZodString;
        earnedAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>>>;
}, z.core.$loose>;
export declare const SourceSchema: z.ZodObject<{
    _id: z.ZodString;
    type: z.ZodEnum<typeof SourceType>;
    file_url: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    spaceId: z.ZodString;
    status: z.ZodEnum<{
        parsing: "parsing";
        parsed: "parsed";
        error: "error";
    }>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$loose>;
export declare const FlashcardSchema: z.ZodObject<{
    _id: z.ZodString;
    question: z.ZodString;
    answer: z.ZodString;
    spaceId: z.ZodString;
    userId: z.ZodString;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodCoercedDate<unknown>]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodCoercedDate<unknown>]>>;
}, z.core.$loose>;
export declare const QuizQuestionSchema: z.ZodObject<{
    question: z.ZodString;
    options: z.ZodArray<z.ZodString>;
    correctAnswer: z.ZodNumber;
    explanation: z.ZodString;
}, z.core.$loose>;
export declare const QuizSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    spaceId: z.ZodString;
    questions: z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        options: z.ZodArray<z.ZodString>;
        correctAnswer: z.ZodNumber;
        explanation: z.ZodString;
    }, z.core.$loose>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$loose>;
export declare const SpaceSchema: z.ZodObject<{
    _id: z.ZodString;
    title: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string, string | null | undefined>>;
    content: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string, string | null | undefined>>;
    userId: z.ZodString;
    summary: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string, string | null | undefined>>;
    sourcesCount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$loose>;
export declare const SpacePreviewSchema: z.ZodObject<{
    title: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string, string | null | undefined>>;
    _id: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
}, z.core.$loose>;
export declare const MessageSchema: z.ZodObject<{
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
    }>;
    content: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export declare const ChatSchema: z.ZodObject<{
    _id: z.ZodString;
    spaceId: z.ZodString;
    userId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodString;
        createdAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
