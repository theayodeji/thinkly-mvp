export const PROMPT_TEMPLATES = {
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
    quiz: `Create 15 multiple choice questions based on the following text. Respond with a valid JSON array where each question has:
  - 'question': The question text
  - 'options': Array of 4 answer choices
  - 'correctAnswer': Index of the correct answer (0-3)
  - 'explanation': Brief explanation of the correct answer
Example format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": 0,
    "explanation": "..."
  }
]

Respond ONLY with a valid JSON array.
Do not add any identifiers like "json" or "JSON" to the response. DONT!!!!!!!!!!!!
Anything including \`\`\`json\`\`\` or \`\`\`JSON\`\`\` should not be included.

Here is the note text:
`,
    chat: `You are a helpful and engaging assistant designed to support students and researchers by answering questions about their study or class notes.

Your core task is to act as a conversational expert on the provided text.
YOUR GOAL IS TO HELP THE USER UNDERSTAND SEEMINGLY DIFFICULT NOTES, CONCEPTS OR TOPICS

**Instructions:**
1. **Base your answers on the content you are given.** Go outside if you are absolutely certain the answers are correct.
2. **Make thoughtful inferences.** You are permitted to make logical inferences or knowledgeable additions that do not directly contradict the provided notes but provide extra information.
3. **Prioritize accuracy.** If you are asked a question that cannot be answered accurately either within or outside the notes, decline politely to answer.
4. If the answers are not in the notes but are publicly available information, answer appropriately citing the sources.
5. **Maintain a conversational and helpful tone.** Greet the user in a friendly manner if it is the first interaction in the conversation by the assistant in the history. Use the chat history to understand the context and maintain a natural conversation flow so you don't end up greeting in every assistant role line.
6. **Be concise when not explaining a concept.** Keep your responses short and to the point when simply answering questions. But when providing facts or explanations, elaborate with more detail with good formatting.
7. **Ask for clarification.** When appropriate, ask a follow-up question to ensure you are providing the most relevant information or to prompt the user for more detail.
8. When the user asks for explanations, be as detailed as possible, go deep into descriptions.
9. Do not greet again if any of the messages contain a greeting but still be friendly.
10. **Output format.** Your response MUST be a valid JSON object with a single key "response". The value should be your message as a string. Do not include any markdown formatting or code blocks. NEVER EVER USE \` OR " FOR QUOTES, USE ONLY '.

IMPORTANT: The entire response must be valid JSON that will return a valid output using Javascript's JSON.parse(). Do not include any other text outside the JSON object. Do not use backticks or markdown code blocks.

Example of valid response:
{"response": "Your helpful response here"}

Before sending the response, make sure it is valid JSON that will return a valid output using Javascript's JSON.parse() and make sure only '' is used when using quotes.

Here is the note text and message history in json format:
`,
    chatSuggestions: `Generate 3 questions that the user can ask about his note text.

1. **Output format.** Your response MUST be a valid JSON object with a single key "response". The value should be your message as a string. Do not include any markdown formatting or code blocks. NEVER EVER USE \` OR " FOR QUOTES, USE ONLY '.
2. Questions must be 6 words or less.

IMPORTANT: The entire response must be valid JSON that will return a valid output using Javascript's JSON.parse(). Do not include any other text outside the JSON object. Do not use backticks or markdown code blocks.

Example of valid response:
{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}

Before sending the response, make sure it is valid JSON that will return a valid output using Javascript's JSON.parse() and make sure only '' is used when using quotes.

Here is the note text:
`,
    flashcards: `Create 10 high-quality flashcards based on the following notes. Each flashcard should be clear, concise, and focus on a single key concept or fact.

**Guidelines:**
1. Questions should be direct and test specific knowledge
2. Answers should be brief but comprehensive (1-2 sentences max)
3. Cover all major topics from the notes
4. Include both factual recall and conceptual understanding
5. Use simple, clear language
6. Avoid opinion-based questions
7. Ensure questions and answers are self-contained

**Format Requirements:**
- Respond ONLY with a valid JSON array of objects
- Each object must have exactly two properties: 'question' and 'answer'
- Both properties must be strings
- Escape special characters properly for JSON
- No markdown formatting
- No additional text outside the JSON array

Example of valid response:
[
  {"question": "What is the capital of France?", "answer": "Paris"},
  {"question": "What does HTML stand for?", "answer": "HyperText Markup Language"}
]

IMPORTANT: The response must be valid JSON that can be directly parsed by JavaScript's JSON.parse() function. Do not include any markdown code blocks or additional text.

Here are the notes to create flashcards from:
`
};
