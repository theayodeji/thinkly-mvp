# Thinkly MVP Roadmap & Strategy

## Strategic Focus
Thinkly is pivoting towards an AI-powered SaaS model for students and learners. 
**Core Challenge:** Balancing highly valuable AI features with API token costs. We need to implement a subscription tier system to "anchor" our expensive AI operations (TTS, large context window parsing, agentic tool calling) and prevent free-tier abuse from exhausting our funds.

## 🟢 Completed (or Foundation Laid)
- [x] **Generated Audio Explainers:** Text-to-speech generation with Fish Audio. (Retry mechanisms built).
- [x] **Decoupled Document Processing:** Server-side PDF extraction. (Foundation for async processing).
- [x] **Study Tools Generation:** Flashcards and quizzes generated from Space contexts.

## 🟡 In Progress / Next Up
- [ ] **Async Processing Queue:** Move heavy tasks (PDF parsing, audio generation, quiz generation) into background queues (e.g., Redis/BullMQ or DB-backed workers) to improve perceived performance and manage rate limits.
- [ ] **SaaS / Subscription Anchoring:** Implement usage tracking, token counting, and tier limits. Restrict expensive models or long context parsing to premium users.

## 🔵 Planned Features (The Pivot)
- [ ] **Learning Path / Mindmap:** Visual breakdown of study spaces to guide student learning.
- [ ] **AI-Assistant Revamp:** 
  - Vision capabilities: Schedule classes from timetable screenshots.
  - Event Management: Reminders for events/assignments.
  - Voice Discussions: ChatGPT-style conversational AI with tool calling capabilities.
- [ ] **Writing Assistants:** Tools that evaluate drafts for grammatical errors, spelling mistakes, clarity, and structural tone before submission.
- [ ] **Weekly Quizzes & Leaderboards:** Gamified weekly quizzes with awards for top winners to drive engagement.

## ⚪ Backlog (Low Priority)
- [ ] Auth optimization (prevent unnecessary re-renders)
- [ ] Add file and text size limits (partially handled by SaaS tiering)
