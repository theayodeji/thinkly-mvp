export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface PromptTemplates {
  summary: string;
  title: string;
  quiz: string;
}

export interface SummaryResponse {
  summary: string;
}

export interface TitleResponse {
  title: string;
}

export const PROMPT_TEMPLATES: PromptTemplates = {
  summary: `Create a concise summary that captures the key points and main ideas from the following text. Focus on the most important information while maintaining accuracy and clarity. Keep it brief but comprehensive.

Respond ONLY with a valid JSON object containing a single 'summary' field.
Do not add any identifiers like "json" or "JSON" to the response. DONT!!!!!!!!!!!!
Example: {"summary": "..."}

Anything including \`\`\`json\`\`\` or \`\`\`JSON\`\`\` should not be included.

Here is the note text:
  `,

  title: `Generate a clear, concise title (3-7 words, maximum 40 carachters, only up to 50 if absolutely necessary) that accurately represents the main topic or theme of the following text. The title should be specific, engaging, and suitable for quick reference.

Respond ONLY with a valid JSON object containing a single 'title' field.
Do not add any identifiers like "json" or "JSON" to the response. DONT!!!!!!!!!!!!
Example: {"title": "..."}

Anything including \`\`\`json\`\`\` or \`\`\`JSON\`\`\` should not be included.


Here is the note/source text:
  `,

  quiz: `Create 10-15 multiple choice questions based on the following text. Respond with a valid JSON array where each question has:
  - 'question': The question text
  - 'options': Array of 4 answer choices
  - 'correctIndex': Index of the correct answer (0-3)
  - 'explanation': Brief explanation of the correct answer
Example format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctIndex": 0,
    "explanation": "..."
  }
]

Respond ONLY with a valid JSON array.
Do not add any identifiers like "json" or "JSON" to the response. DONT!!!!!!!!!!!!
Anything including \`\`\`json\`\`\` or \`\`\`JSON\`\`\` should not be included.

Here is the note text:
`
};

export type PromptType = keyof PromptTemplates;
