# Server Run 1: Architecture and Folder Structure Audit

## Observations
1. **Controller-heavy server design:** The server has a conventional folder split (`controllers`, `routes`, `models`, `services`, `utils`, `middleware`), but the controllers still own too much. `authController.ts`, `noteController.ts`, `sourceController.ts`, `quizController.ts`, and `flashcardController.ts` combine request validation, transactions, persistence, AI calls, and response shaping in the same layer.
2. **Mixed orchestration boundaries:** Auth logic is spread across `authController.ts`, `authRoutes.ts`, `config/passport.ts`, `middleware/auth.ts`, `utils/auth.ts`, `utils/jwt.ts`, and `services/streakService.ts`. That makes it unclear which module is the canonical owner of token issuance, OAuth linking, cookie policy, and streak updates.
3. **Event layer drift:** `lib/events` appears to be a second attempt at streak/event orchestration, but the app still uses `StreakService` directly. The empty `lib/events/index.ts` and the separate `lib/events/handlers/streak.ts` indicate the architecture is not yet consolidated.
4. **Transaction boilerplate repetition:** The note/source/quiz/flashcard workflows repeatedly open Mongo sessions, start transactions, commit, abort, and end sessions in very similar shapes. That indicates missing shared infrastructure for transactional work.
5. **Inconsistent ownership enforcement:** Several read/update/delete handlers rely on `_id` lookups and middleware assumptions instead of consistently including `userId` in the query. The pattern is visible across note, quiz, flashcard, and source flows.
6. **Config and source-tree drift:** `tsconfig.json` uses a `rootDir` that does not match the actual workspace tree, `src/test-gemini.ts` is sitting in runtime source, and `controllers/pomodoroController.ts` uses a non-relative import that is inconsistent with the rest of the server.

## Recommendations
1. **Introduce a service boundary for content workflows:** Move note/source/quiz/flashcard transaction logic into dedicated service functions and leave controllers with routing, validation, and response formatting only.
2. **Make auth ownership explicit:** Decide which module owns token creation, cookie policy, OAuth callback handling, and streak updates, then collapse the duplicated logic into one path.
3. **Retire or merge the event layer:** Either wire `lib/events` fully into production flows or remove it until there is a clear event-driven use case. Right now it adds conceptual overhead without becoming the canonical path.
4. **Normalize structure and module resolution:** Fix the `tsconfig` root settings, move stray test harnesses out of `src`, and standardize import style so the server compiles and resolves modules predictably.
5. **Centralize repeated validation and transaction helpers:** Add reusable helpers for `ObjectId` validation and Mongo session lifecycle management to reduce the controller boilerplate that currently repeats across the codebase.

## Test Points
1. Auth flows: register, login, refresh token, logout, and Google OAuth callback.
2. Note/content workflows: create, rename, delete, chat, flashcard generation, quiz generation, and source add/delete.
3. Transaction behavior: verify rollback when Gemini or DB writes fail midway through a content workflow.
4. Ownership enforcement: confirm that cross-user access is rejected on note, quiz, flashcard, and source routes.
5. Bootstrapping and config: missing environment variables, `tsconfig` path/root behavior, and module resolution on Windows.

## Production Considerations
1. Add route-level schema validation before controller logic.
2. Fail fast on missing environment variables instead of falling back to weak defaults.
3. Treat Gemini output as untrusted input and validate it before parsing or persistence.
4. Consolidate logging and error handling so auth, transaction, and AI failures are easier to diagnose in production.
5. Decide whether the event layer is a real production dependency or just a future abstraction, then simplify accordingly.
