import { generateObject, streamText, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { config } from "../config/env.js";
import type {
  ChatSuggestionsResponse,
  PromptType,
  QuizQuestion,
  SummaryResponse,
  TitleResponse,
} from "./prompts.js";
import { PROMPT_TEMPLATES } from "./prompts.js";

const google = createGoogleGenerativeAI({
  apiKey: config.GEMINI_API_KEY,
});

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

// Schemas for validation
const SummarySchema = z.object({
  summary: z.string(),
});

const TitleSchema = z.object({
  title: z.string(),
});

const QuizSchema = z.array(
  z.object({
    question: z.string(),
    options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
    correctAnswer: z.number(),
    explanation: z.string(),
  }),
);

const ChatSuggestionsSchema = z.object({
  questions: z.array(z.string()),
});

const FlashcardsSchema = z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
  }),
);

const LearningPathSchema = z.union([
  z.object({
    topic: z.string(),
    nodes: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
        topicsCovered: z.array(z.string()),
      })
    ),
  }),
  z.object({
    error: z.string(),
  })
]);

class GeminiService {
  private modelName: string;

  constructor(modelName: string = DEFAULT_MODEL) {
    this.modelName = modelName;
  }

  private constructPrompt(promptType: PromptType, content: string): string {
    const template = PROMPT_TEMPLATES[promptType];
    return `${template}\n\n ${content}`;
  }

  public async generateChatStream(content: string): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      const prompt = this.constructPrompt("chat", content);
      const { textStream } = streamText({
        model: google(this.modelName),
        prompt: prompt,
      });

      async function* streamGenerator() {
        for await (const chunk of textStream) {
          yield chunk;
        }
      }
      return streamGenerator();
    } catch (error) {
      console.error("Error generating chat stream:", error);
      throw error;
    }
  }

  public async generateSummary(content: string): Promise<SummaryResponse> {
    const prompt = this.constructPrompt("summary", content);
    const { object } = await generateObject({
      model: google(this.modelName),
      schema: SummarySchema,
      prompt: prompt,
    });
    return object;
  }

  public async generateTitle(content: string): Promise<TitleResponse> {
    const prompt = this.constructPrompt("title", content);
    const { object } = await generateObject({
      model: google(this.modelName),
      schema: TitleSchema,
      prompt: prompt,
    });
    return object;
  }

  public async generateQuiz(content: string): Promise<QuizQuestion[]> {
    const prompt = this.constructPrompt("quiz", content);
    const { object } = await generateObject({
      model: google(this.modelName),
      schema: QuizSchema,
      prompt: prompt,
    });
    return object as QuizQuestion[];
  }

  public async generateChatSuggestions(
    content: string,
  ): Promise<ChatSuggestionsResponse> {
    const prompt = this.constructPrompt("chatSuggestions", content);
    const { object } = await generateObject({
      model: google(this.modelName),
      schema: ChatSuggestionsSchema,
      prompt: prompt,
    });
    return object;
  }

  public async generateFlashcards(
    content: string,
  ): Promise<Array<{ question: string; answer: string }>> {
    const prompt = this.constructPrompt("flashcards", content);
    const { object } = await generateObject({
      model: google(this.modelName),
      schema: FlashcardsSchema,
      prompt: prompt,
    });
    return object;
  }

  public async generateLearningPath(
    topic: string,
    content: string
  ): Promise<{ topic?: string; nodes?: any[]; error?: string }> {
    const combinedContent = `Requested Topic: ${topic}\n\nSource Notes:\n${content}`;
    const prompt = this.constructPrompt("learningPath", combinedContent);
    const { object } = await generateObject({
      model: google(this.modelName),
      schema: LearningPathSchema,
      prompt: prompt,
    });
    return object;
  }

  public async generateContent(prompt: string): Promise<string> {
    const { text } = await generateText({
      model: google(this.modelName),
      prompt: prompt,
    });
    return text;
  }
}

// Keeping the name geminiService for backwards compatibility with existing imports, 
// even though it's now provider-agnostic under the hood!
const geminiService = new GeminiService();

export default geminiService;
