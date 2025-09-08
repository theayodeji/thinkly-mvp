import geminiService from './utils/genai.js';
import type { QuizQuestion } from './utils/prompts.js';

const TEST_TEXT = `
The theory of relativity is a scientific theory about space and time. 
It was developed by Albert Einstein in the early 20th century. 
There are two types of relativity: special relativity and general relativity. 
Special relativity deals with objects moving at constant speeds, while general relativity 
includes acceleration and gravity. The theory has been confirmed by numerous experiments 
and is fundamental to modern physics.
`;

async function testGeminiService() {
  try {
    console.log('=== Testing Gemini Service ===\n');

    // Test summary generation
    console.log('1. Testing summary generation...');
    const { summary } = await geminiService.generateSummary(TEST_TEXT);
    console.log('Summary:', summary);

    // Test title generation
    console.log('\n2. Testing title generation...');
    const { title } = await geminiService.generateTitle(TEST_TEXT);
    console.log('Title:', title);

    // Test quiz generation
    console.log('\n3. Testing quiz generation...');
    const quiz = await geminiService.generateQuiz(TEST_TEXT);
    console.log('Quiz Questions:');
    quiz.forEach((q: QuizQuestion, i: number) => {
      console.log(`\nQ${i + 1}: ${q.question}`);
      q.options.forEach((opt, j) => {
        console.log(`   ${j === q.correctIndex ? '✓' : ' '} ${opt}${j === q.correctIndex ? ' (Correct)' : ''}`);
      });
      console.log(`   Explanation: ${q.explanation}`);
    });

    console.log('\n=== All tests completed successfully! ===');
  } catch (error) {
    console.error('Error during tests:', error);
    process.exit(1);
  }
}

// Run the tests
testGeminiService();
