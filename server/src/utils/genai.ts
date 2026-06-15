import { GoogleGenerativeAI, type GenerateContentResult } from "@google/generative-ai";
import { z } from "zod";
import { config } from "../config/env.js";
import type { 
  ChatSuggestionsResponse,
  PromptType, 
  QuizQuestion, 
  SummaryResponse, 
  TitleResponse 
} from "./prompts.js";
import { PROMPT_TEMPLATES } from "./prompts.js";

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

// Schemas for validation
const SummarySchema = z.object({
  summary: z.string()
});

const TitleSchema = z.object({
  title: z.string()
});

const QuizSchema = z.array(z.object({
  question: z.string(),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctAnswer: z.number(),
  explanation: z.string()
}));

const ChatSuggestionsSchema = z.object({
  questions: z.array(z.string())
});

const FlashcardsSchema = z.array(z.object({
  question: z.string(),
  answer: z.string()
}));

const ChatSchema = z.object({
  response: z.string()
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

  private async generateContent(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating content:", error);
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async processPrompt<T>(
    promptType: PromptType,
    content: string,
    schema?: z.ZodType<T>
  ): Promise<T> {
    try {
      const prompt = this.constructPrompt(promptType, content);
      let response = await this.generateContent(prompt);
      
      if (schema) {
        try {
          // Remove markdown code blocks if present
          response = response.replace(/^```(?:json)?\n|\n```$/g, '').trim();
          const parsed = JSON.parse(response);
          return schema.parse(parsed);
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
  public async generateChat(content: string): Promise<string> {
    const result = await this.processPrompt("chat", content, ChatSchema);
    return JSON.stringify(result); // Legacy behavior returning JSON string to the controller
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
  public async generateChatSuggestions(content: string): Promise<ChatSuggestionsResponse> {
    return this.processPrompt("chatSuggestions", content, ChatSuggestionsSchema);
  }
  public async generateFlashcards(content: string): Promise<Array<{ question: string; answer: string }>> {
    return this.processPrompt("flashcards", content, FlashcardsSchema);
  }
}

// Initialize with environment variable
const geminiService = new GeminiService(config.GEMINI_API_KEY);

export default geminiService;
