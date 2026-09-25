import { GoogleGenerativeAI, } from "@google/generative-ai";
import { z } from "zod";
import { config } from "../config/env.js";
import { PROMPT_TEMPLATES } from "./prompts.js";
const DEFAULT_MODEL = "gemini-2.5-flash-lite";
// Schemas for validation
const SummarySchema = z.object({
    summary: z.string(),
});
const TitleSchema = z.object({
    title: z.string(),
});
const QuizSchema = z.array(z.object({
    question: z.string(),
    options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
    correctAnswer: z.number(),
    explanation: z.string(),
}));
const ChatSuggestionsSchema = z.object({
    questions: z.array(z.string()),
});
const FlashcardsSchema = z.array(z.object({
    question: z.string(),
    answer: z.string(),
}));
const ChatSchema = z.object({
    response: z.string(),
});
class GeminiService {
    constructor(apiKey, modelName = DEFAULT_MODEL) {
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in environment variables");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.modelName = modelName;
    }
    async generateContent(prompt, isJson = false) {
        try {
            const model = this.genAI.getGenerativeModel({
                model: this.modelName,
                ...(isJson ? { generationConfig: { responseMimeType: "application/json" } } : {})
            });
            const result = await model.generateContent(prompt);
            const response = result.response;
            return response.text();
        }
        catch (error) {
            console.error("Error generating content:", error);
            throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async processPrompt(promptType, content, schema) {
        try {
            const prompt = this.constructPrompt(promptType, content);
            let response = await this.generateContent(prompt, !!schema);
            if (schema) {
                try {
                    // Remove markdown code blocks if present
                    response = response.replace(/^```(?:json)?\n|\n```$/g, "").trim();
                    const parsed = JSON.parse(response);
                    return schema.parse(parsed);
                }
                catch (e) {
                    console.error("Failed to parse or validate JSON response:", response, e);
                    throw new Error("Failed to parse or validate model response as expected JSON");
                }
            }
            return response;
        }
        catch (error) {
            console.error(`Error in processPrompt (${promptType}):`, error);
            throw error;
        }
    }
    constructPrompt(promptType, content) {
        const template = PROMPT_TEMPLATES[promptType];
        return `${template}\n\n ${content}`;
    }
    // Convenience methods for specific prompt types
    async generateChatStream(content) {
        try {
            const prompt = this.constructPrompt("chat", content);
            const model = this.genAI.getGenerativeModel({ model: this.modelName });
            const result = await model.generateContentStream(prompt);
            // result.response is a Promise that rejects if the stream fails.
            // We must catch it to prevent unhandled promise rejections that crash the server.
            result.response.catch(() => { });
            async function* streamGenerator() {
                for await (const chunk of result.stream) {
                    yield chunk.text();
                }
            }
            return streamGenerator();
        }
        catch (error) {
            console.error("Error generating chat stream:", error);
            throw error;
        }
    }
    async generateSummary(content) {
        return this.processPrompt("summary", content, SummarySchema);
    }
    async generateTitle(content) {
        return this.processPrompt("title", content, TitleSchema);
    }
    async generateQuiz(content) {
        return this.processPrompt("quiz", content, QuizSchema);
    }
    async generateChatSuggestions(content) {
        return this.processPrompt("chatSuggestions", content, ChatSuggestionsSchema);
    }
    async generateFlashcards(content) {
        return this.processPrompt("flashcards", content, FlashcardsSchema);
    }
}
// Initialize with environment variable
const geminiService = new GeminiService(config.GEMINI_API_KEY);
export default geminiService;
