import { z } from "zod";
import { SourceType } from "./types.js";
export declare const objectIdSchema: z.ZodString;
export declare const paramsIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const paramsNoteIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        noteId: z.ZodString;
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
export declare const updateNoteSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        title: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const addSourceSchema: z.ZodObject<{
    body: z.ZodObject<{
        noteId: z.ZodString;
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
        noteId: z.ZodString;
        message: z.ZodString;
        history: z.ZodArray<z.ZodAny>;
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
    noteId: z.ZodString;
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
    noteId: z.ZodString;
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
    noteId: z.ZodString;
    questions: z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        options: z.ZodArray<z.ZodString>;
        correctAnswer: z.ZodNumber;
        explanation: z.ZodString;
    }, z.core.$loose>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$loose>;
export declare const NoteSchema: z.ZodObject<{
    _id: z.ZodString;
    title: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string, string | null | undefined>>;
    content: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string, string | null | undefined>>;
    sources: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        _id: z.ZodString;
        type: z.ZodEnum<typeof SourceType>;
        file_url: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        noteId: z.ZodString;
        status: z.ZodEnum<{
            parsing: "parsing";
            parsed: "parsed";
            error: "error";
        }>;
        createdAt: z.ZodCoercedDate<unknown>;
        updatedAt: z.ZodCoercedDate<unknown>;
    }, z.core.$loose>]>>>>, z.ZodTransform<(string | {
        [x: string]: unknown;
        _id: string;
        type: SourceType;
        noteId: string;
        status: "parsing" | "parsed" | "error";
        createdAt: Date;
        updatedAt: Date;
        file_url?: string | undefined;
        name?: string | undefined;
        text?: string | undefined;
    })[], (string | {
        [x: string]: unknown;
        _id: string;
        type: SourceType;
        noteId: string;
        status: "parsing" | "parsed" | "error";
        createdAt: Date;
        updatedAt: Date;
        file_url?: string | undefined;
        name?: string | undefined;
        text?: string | undefined;
    })[] | null | undefined>>;
    userId: z.ZodString;
    summary: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string, string | null | undefined>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    quiz: z.ZodOptional<z.ZodString>;
    chatSuggestions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    flashcards: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        _id: z.ZodString;
        question: z.ZodString;
        answer: z.ZodString;
        noteId: z.ZodString;
        userId: z.ZodString;
        createdAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodCoercedDate<unknown>]>>;
        updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodCoercedDate<unknown>]>>;
    }, z.core.$loose>]>>>;
}, z.core.$loose>;
export declare const NotePreviewSchema: z.ZodObject<{
    title: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string, string | null | undefined>>;
    _id: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
    sources: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        _id: z.ZodString;
        type: z.ZodEnum<typeof SourceType>;
        file_url: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        noteId: z.ZodString;
        status: z.ZodEnum<{
            parsing: "parsing";
            parsed: "parsed";
            error: "error";
        }>;
        createdAt: z.ZodCoercedDate<unknown>;
        updatedAt: z.ZodCoercedDate<unknown>;
    }, z.core.$loose>]>>>>, z.ZodTransform<(string | {
        [x: string]: unknown;
        _id: string;
        type: SourceType;
        noteId: string;
        status: "parsing" | "parsed" | "error";
        createdAt: Date;
        updatedAt: Date;
        file_url?: string | undefined;
        name?: string | undefined;
        text?: string | undefined;
    })[], (string | {
        [x: string]: unknown;
        _id: string;
        type: SourceType;
        noteId: string;
        status: "parsing" | "parsed" | "error";
        createdAt: Date;
        updatedAt: Date;
        file_url?: string | undefined;
        name?: string | undefined;
        text?: string | undefined;
    })[] | null | undefined>>;
}, z.core.$loose>;
