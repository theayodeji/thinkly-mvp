import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
});

export const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
  })
});

export const addSourceSchema = z.object({
  body: z.object({
    noteId: z.string().min(1, 'Note ID is required'),
    type: z.enum(['text', 'file', 'link']),
    text: z.string().optional(),
    name: z.string().optional(),
  }).refine((data) => {
    if (data.type === 'text' && !data.text) {
      return false;
    }
    return true;
  }, {
    message: "Text is required when type is 'text'",
    path: ["text"]
  })
});

export const submitQuizSchema = z.object({
  body: z.object({
    answers: z.array(z.number().nullable())
  })
});

export const chatSchema = z.object({
  body: z.object({
    noteId: z.string().min(1, 'Note ID is required'),
    history: z.array(z.any()),
  })
});
