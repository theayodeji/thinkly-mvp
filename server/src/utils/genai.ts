import { GoogleGenerativeAI, type GenerateContentResult } from "@google/generative-ai";
import type { 
  PromptType, 
  QuizQuestion, 
  SummaryResponse, 
  TitleResponse 
} from "./prompts.js";
import { PROMPT_TEMPLATES } from "./prompts.js";

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

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

  public async processPrompt<T = string>(
    promptType: PromptType,
    content: string,
    parseJson: boolean = false
  ): Promise<T> {
    try {
      const prompt = this.constructPrompt(promptType, content);
      let response = await this.generateContent(prompt);
      
      if (parseJson) {
        try {
          // Remove markdown code blocks if present
          response = response.replace(/^```(?:json)?\n|\n```$/g, '').trim();
          return JSON.parse(response) as T;
        } catch (e) {
          console.error("Failed to parse JSON response:", response);
          throw new Error("Failed to parse model response as JSON");
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
    return this.processPrompt<string>("chat", content);
  }

  public async generateSummary(content: string): Promise<SummaryResponse> {
    return this.processPrompt<SummaryResponse>("summary", content, true);
  }

  public async generateTitle(content: string): Promise<TitleResponse> {
    return this.processPrompt<TitleResponse>("title", content, true);
  }

  public async generateQuiz(content: string): Promise<QuizQuestion[]> {
    return this.processPrompt<QuizQuestion[]>("quiz", content, true);
  }
}

// Initialize with environment variable
const geminiService = new GeminiService(process.env.GEMINI_API_KEY || "");

export default geminiService;
