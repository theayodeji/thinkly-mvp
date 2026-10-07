# Thinkly MVP: Comprehensive Permissions & Usage Limits Architecture Specification

**Status:** Ready for Implementation  
**Target Environments:** Staging/Beta (`APP_MODE=beta`) and Production/Launch (`APP_MODE=launch`)  
**Package Scope:** `@thinkly/shared`, `server`, `client`

---

## 1. Executive Summary & Architectural Motivation

Thinkly MVP currently uses an ad-hoc usage limit pattern that lumps disparate generative actions into a single `dailyAIActionsCount`. As features grew (AI Chat, Practice Quizzes, Flashcards, Learning Paths, and Audio Explainers), this created ambiguity in user experience and inconsistent quota enforcement.

This specification details a **unified, reliable Permission & Metered Limit System** designed to:
1. Decouple **Feature Entitlements** (can user access a feature at all?) from **Metered Quotas** (how much can user consume in a period?).
2. Support distinct rules for **Beta Preview** vs **Launch Modes** from a single canonical codebase.
3. Provide predictable database tracking, atomic increments, and automatic UTC daily resets.
4. Supply frontend components with reactive usage feedback, disabled states, and contextual upgrade prompts.

---

## 2. Policy Matrix: Environment & Tier Constraints

### 2.1 Summary Table

| Feature / Metric | Beta (All Testers) | Launch: Free Scholar | Launch: Thinkly PRO | Enforcement Window |
| :--- | :--- | :--- | :--- | :--- |
| **Active Study Spaces** | **1 Space** | **3 Spaces** | **Unlimited** (`Infinity`) | Total concurrent |
| **AI Chat Messages** | **20 msgs / space** | **25 msgs / day** | **Unlimited** (`Infinity`) | Space lifetime (Beta) / Daily (Launch) |
| **Practice Quizzes** | **1 quiz / day** | **2 quizzes / day** | **Unlimited** (`Infinity`) | Daily (UTC) |
| **Flashcard Generations**| **1 set / day** | **2 sets / day** | **Unlimited** (`Infinity`) | Daily (UTC) |
| **Audio Explainer (TTS)**| **1 explainer / day** | **0 (Feature Locked)** | **10 explainers / day** | Daily (UTC) |
| **Learning Path Maps** | **2 paths / day** | **0 (Feature Locked)** | **Unlimited** (`Infinity`) | Daily (UTC) |
| **File Upload Limit** | **5 MB (Dynamic)** | **5 MB (Dynamic)** | **5 MB (Dynamic)** | Per file upload |

> [!NOTE]
> **Beta Space Message Reset:** The 20-message limit in Beta is tracked **per study space lifetime**. Deleting a space permanently deletes its chat history, allowing users to create a new space and receive another 20 messages.

---

## 3. Shared Contracts (`packages/shared`)

### 3.1 Feature & Metric Enumerations
```ts
// packages/shared/src/constants/permissions.ts

export enum FeatureKey {
  CREATE_SPACE = "create_space",
  AI_CHAT = "ai_chat",
  GENERATE_QUIZ = "generate_quiz",
  GENERATE_FLASHCARDS = "generate_flashcards",
  GENERATE_AUDIO = "generate_audio",
  GENERATE_LEARNING_PATH = "generate_learning_path",
}

export enum MeteredMetric {
  ACTIVE_SPACES = "active_spaces",
  CHAT_MESSAGES = "chat_messages",
  QUIZZES = "quizzes",
  FLASHCARDS = "flashcards",
  AUDIO_EXPLAINERS = "audio_explainers",
  LEARNING_PATHS = "learning_paths",
}
```

### 3.2 Granular Plan Limits
```ts
// packages/shared/src/constants/plans.ts

export interface PlanLimits {
  maxActiveSpaces: number;
  maxMessagesPerSpace?: number;             // Used in Beta: 20 per space
  maxDailyChatMessages?: number;            // Used in Launch Free: 25 per day
  maxDailyQuizGenerations: number;          // Beta: 1, Launch Free: 2, Pro: Infinity
  maxDailyFlashcardGenerations: number;     // Beta: 1, Launch Free: 2, Pro: Infinity
  maxDailyAudioGenerations: number;         // Beta: 1, Launch Free: 0, Pro: 10
  maxDailyLearningPathGenerations: number;  // Beta: 2, Launch Free: 0, Pro: Infinity
  maxUploadSizeBytes: number;               // Dynamic: 5MB
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  description: string;
  priceNGN: number;
  priceUSD: number;
  limits: PlanLimits;
  allowedFeatures: FeatureKey[];
}
```

### 3.3 Dynamic Upload Configuration
```ts
// packages/shared/src/constants/plans.ts
export const DEFAULT_MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const getMaxUploadSizeBytes = (): number => {
  const envVal =
    typeof process !== "undefined" && process.env?.MAX_UPLOAD_SIZE_BYTES
      ? parseInt(process.env.MAX_UPLOAD_SIZE_BYTES, 10)
      : undefined;
  return !isNaN(envVal as number) && (envVal as number) > 0
    ? (envVal as number)
    : DEFAULT_MAX_UPLOAD_SIZE_BYTES;
};
```

---

## 4. Database Schema & Usage Tracking (`server`)

### 4.1 User Document Schema
In `server/src/models/User.ts`, replace single counters with a structured `dailyUsage` subdocument:

```ts
export interface IDailyUsage {
  date: Date;
  chatMessages: number;
  quizzes: number;
  flashcards: number;
  audio: number;
  learningPaths: number;
}

// In userSchema:
dailyUsage: {
  date: { type: Date, default: Date.now },
  chatMessages: { type: Number, default: 0 },
  quizzes: { type: Number, default: 0 },
  flashcards: { type: Number, default: 0 },
  audio: { type: Number, default: 0 },
  learningPaths: { type: Number, default: 0 },
}
```

### 4.2 UTC Midnight Reset & Increment Algorithm
Daily counters are validated and reset lazily on incoming requests:
```ts
// server/src/services/identity/limits/usageTracker.ts

export async function getFreshUserWithReset(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const usageDateStr = user.dailyUsage?.date
    ? new Date(user.dailyUsage.date).toISOString().slice(0, 10)
    : "";

  if (todayStr !== usageDateStr) {
    user.dailyUsage = {
      date: new Date(),
      chatMessages: 0,
      quizzes: 0,
      flashcards: 0,
      audio: 0,
      learningPaths: 0,
    };
    await user.save();
  }

  return user;
}
```

### 4.3 Space-Lifetime Chat Tracking
For Beta mode chat (`maxMessagesPerSpace = 20`):
- Message count is queried directly:
  ```ts
  const userMessageCount = await MessageModel.countDocuments({
    spaceId,
    role: "user",
  });
  ```
- **Cleanup Guarantee:** When a space is deleted in `server/src/services/content/spaces/management.ts`:
  ```ts
  await MessageModel.deleteMany({ spaceId: id }).session(session);
  await ChatModel.deleteMany({ spaceId: id }).session(session);
  ```
  Deleting the space naturally wipes all stored user messages, resetting the 20-message quota when the user creates a new space.

---

## 5. Middleware & Guard Architecture (`server`)

### 5.1 Route Guards

```
[Request]
   │
   ▼
[authenticateJWT / allowGuest]
   │
   ▼
[checkFeatureAccess(FeatureKey)] ──(Not Allowed)──► 403 Forbidden (Code: FEATURE_LOCKED)
   │
   ▼
[checkMeteredLimit(MeteredMetric)] ──(Quota Reached)─► 403 Forbidden (Code: LIMIT_REACHED)
   │
   ▼
[Controller Handler]
   │
   ▼
[incrementMeteredUsage(MeteredMetric)]
```

### 5.2 Error Response Format
All limit & permission rejections return consistent JSON:
```json
{
  "status": "fail",
  "code": "LIMIT_REACHED",
  "message": "You have reached the 20-message limit for this space in Beta. Delete this space and create another to start fresh!",
  "meta": {
    "metric": "chat_messages",
    "current": 20,
    "max": 20,
    "resetsAt": null,
    "scope": "space"
  }
}
```

---

## 6. Frontend Boundary & UX Feedback (`client`)

### 6.1 Unified `usePermissionsAndLimits` Hook
A central React hook consuming `useAuth()` and `@thinkly/shared`:
- `canAccess(feature: FeatureKey): boolean`
- `getLimitStatus(metric: MeteredMetric, spaceContext?: { spaceId: string, messagesCount: number })`:
  - Returns `{ current, max, remaining, isReached, isLocked }`
- `triggerLimitModal(reason?: string, code?: string)`:
  - Dispatches `thinkly:beta-limit-modal` in Beta mode.
  - Dispatches `thinkly:upgrade-modal` in Launch mode.

### 6.2 Component Interactions
1. **ChatInterface & ChatInput:**
   - Beta: Displays `"X of 20 space messages remaining"`. Reaching 20 disables send and informs user they can reset by deleting and recreating the space.
   - Launch: Displays `"X of 25 daily messages remaining"`.
2. **Audio Explainer Modal:**
   - Beta: Displays `"1 of 1 daily voice generation remaining"`.
   - Launch Free: Displays locked banner `"Upgrade to PRO to unlock Audio Explainers"`.
3. **Practice Quiz & Learning Path Modals:**
   - Modals render remaining daily uses directly inside the header/prompt card.
   - Locked features in Launch Free display paywall prompt leading to Paystack upgrade checkout.
4. **File Upload Dropzone:**
   - Enforces `maxSize: getMaxUploadSizeBytes()` (5 MB) client-side and server-side.

---

## 7. Implementation Roadmap for Agents

- [ ] **Phase 1: `@thinkly/shared`**
  - Define `FeatureKey`, `MeteredMetric`, updated `PlanLimits`, and `BETA_PLAN_CONFIGS` / `LAUNCH_PLAN_CONFIGS`.
  - Export `getMaxUploadSizeBytes` and `DEFAULT_MAX_UPLOAD_SIZE_BYTES`.
- [ ] **Phase 2: Database & Backend Services**
  - Update `User` model with `dailyUsage` subdocument.
  - Implement `usageTracker.ts` for UTC resets and atomic increments.
  - Add chat message cascade cleanup in `deleteSpaceById`.
- [ ] **Phase 3: Route Middleware**
  - Refactor `usageLimit.ts` into declarative middleware (`checkFeatureAccess`, `checkMeteredLimit`).
  - Wire to routes: `/spaces/create`, `/:id/chat`, `/quiz/:spaceId/generate`, `/flashcards/generate`, `/explainers`, `/learning-path`.
- [ ] **Phase 4: Client Hooks & UI**
  - Create `usePermissionsAndLimits` hook.
  - Connect badges and button guards in `ChatInput`, `ExplainerModal`, `LearningPathModal`, `PracticeQuizModal`, `ToolsSection`.
- [ ] **Phase 5: Verification & Testing**
  - Verify Beta constraints (1 space, 20 msgs per space, 1 quiz/day, 1 audio/day, 2 paths/day, 1 flashcards/day).
  - Verify Launch Free & Pro constraints.
  - Verify 5 MB dynamic file upload limit across client dropzone and server multer.
