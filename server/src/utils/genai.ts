import {
  GoogleGenerativeAI,
  type GenerateContentResult,
} from "@google/generative-ai";
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

const ChatSchema = z.object({
  response: z.string(),
});

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string = DEFAULT_MODEL) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  public async generateContent(prompt: string, isJson: boolean = false): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        ...(isJson ? { generationConfig: { responseMimeType: "application/json" } } : {})
      });
      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating content:", error);
      throw new Error(
        `Failed to generate content: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private parseAndValidate<T>(response: string, schema: z.ZodType<T>): T {
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      try {
        parsed = JSON.parse(response.replace(/\n/g, "\\n").replace(/\t/g, "\\t"));
      } catch {
        parsed = JSON.parse(response.replace(/[\n\r\t]/g, " "));
      }
    }

    try {
      return schema.parse(parsed);
    } catch (validationError) {
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const keys = Object.keys(parsed);
        if (keys.length === 1) {
          const unwrapped = schema.safeParse(parsed[keys[0]]);
          if (unwrapped.success) return unwrapped.data;
        }
      }
      throw validationError;
    }
  }

  public async processPrompt<T>(
    promptType: PromptType,
    content: string,
    schema?: z.ZodType<T>,
  ): Promise<T> {
    try {
      const prompt = this.constructPrompt(promptType, content);
      let response = await this.generateContent(prompt, !!schema);

      if (schema) {
        try {
          response = response.replace(/^```(?:json)?\n|\n```$/g, "").trim();
          return this.parseAndValidate(response, schema);
        } catch (e) {
          console.error("Failed to parse or validate JSON response:", response, e);
          throw new Error("Failed to parse or validate model response as expected JSON");
        }
      }

      return response as unknown as T;
    } catch (error) {
      console.error(`Error in processPrompt (${promptType}):`, error);
      throw error;
    }
  }

  private constructPrompt(promptType: PromptType, content: string): string {
    const template = PROMPT_TEMPLATES[promptType];
    return `${template}\n\n ${content}`;
  }

  // Convenience methods for specific prompt types
  public async generateChatStream(content: string): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      const prompt = this.constructPrompt("chat", content);
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContentStream(prompt);

      // result.response is a Promise that rejects if the stream fails.
      // We must catch it to prevent unhandled promise rejections that crash the server.
      result.response.catch(() => {});

      async function* streamGenerator() {
        for await (const chunk of result.stream) {
          yield chunk.text();
        }
      }
      return streamGenerator();
    } catch (error) {
      console.error("Error generating chat stream:", error);
      throw error;
    }
  }

  public async generateSummary(content: string): Promise<SummaryResponse> {
    return this.processPrompt("summary", content, SummarySchema);
  }

  public async generateTitle(content: string): Promise<TitleResponse> {
    return this.processPrompt("title", content, TitleSchema);
  }

  public async generateQuiz(content: string): Promise<QuizQuestion[]> {
    return this.processPrompt("quiz", content, QuizSchema as any);
  }
  public async generateChatSuggestions(
    content: string,
  ): Promise<ChatSuggestionsResponse> {
    return this.processPrompt(
      "chatSuggestions",
      content,
      ChatSuggestionsSchema,
    );
  }
  public async generateFlashcards(
    content: string,
  ): Promise<Array<{ question: string; answer: string }>> {
    return this.processPrompt("flashcards", content, FlashcardsSchema);
  }
}

// Initialize with environment variable
const geminiService = new GeminiService(config.GEMINI_API_KEY);

export default geminiService;
