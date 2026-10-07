# Thinkly MVP: Internal Architecture, Data Layer & API Specification

**Document Version:** 1.0.0  
**Last Updated:** October 2026  
**Target Audience:** Engineering Team, Backend Developers, Frontend Developers, QA Engineers, Architect  
**Codebase Structure:** Monorepo (`pnpm` workspaces + Turborepo)

---

## 1. Monorepo Architecture & Engineering Principles

Thinkly MVP is structured as a TypeScript monorepo managed via **pnpm workspaces** and **Turborepo**.

```
thinkly-mvp/
├── packages/
│   └── shared/               # @thinkly/shared: Pure TypeScript models, Zod schemas, constants & plan configs
├── server/                   # Node.js + Express backend (MongoDB, Mongoose, GenAI, Fish Audio, Paystack)
├── client/                   # React + Vite frontend (Tailwind CSS, React Query, Zustand, Framer Motion)
└── docs/                     # Architectural specifications and developer guides
```

### 1.1 Strict Architectural Rules
1. **Single Source of Truth (`@thinkly/shared`)**: All data models, request/response DTOs, enumerations, feature flags, and Zod schemas MUST be defined in `packages/shared`.
2. **Service Layer Boundary (Server)**: Controllers MUST NOT contain raw database queries (Mongoose) or business orchestration. Controllers only extract requests, validate using Zod middleware, invoke dedicated services in `src/services/`, and format responses.
3. **API Boundary Validation (Client)**: Do not rely on generic type casting (`as Space`). incoming remote data is validated and handled via structured DTOs.
4. **State Management Separation**: Server state is managed exclusively via **React Query** (`@tanstack/react-query`). Client UI state (e.g. sidebar collapse, active tab) is managed via **Zustand**.
5. **No Native `npm` or `yarn`**: Always use `pnpm` (`pnpm dev`, `pnpm build`, `pnpm --filter client build`).

---

## 2. Shared Data Layer (`@thinkly/shared`)

The `@thinkly/shared` package is compiled as an ES Module using native ES module resolution (`NodeNext`). All internal cross-imports within `packages/shared/src/` use explicit `.js` extensions.

### 2.1 Enumerations & Feature Flags

```ts
// Plan Tiers
export enum PlanTier {
  FREE = "free",
  PRO = "pro",
}

// System Feature Flags
export enum FeatureFlag {
  CREATE_SPACE = "create_space",
  GENERATE_QUIZ = "generate_quiz",
  GENERATE_FLASHCARDS = "generate_flashcards",
  GENERATE_AUDIO = "generate_audio",
  GENERATE_LEARNING_PATH = "generate_learning_path",
  AI_CHAT = "ai_chat",
}

// Metered Metrics for Quota Tracking
export enum MeteredMetric {
  ACTIVE_SPACES = "active_spaces",
  CHAT_MESSAGES = "chat_messages",
  QUIZZES = "quizzes",
  FLASHCARDS = "flashcards",
  AUDIO_EXPLAINERS = "audio_explainers",
  LEARNING_PATHS = "learning_paths",
}

// Application Modes
export type AppMode = "beta" | "launch";
```

### 2.2 Domain Entities & TypeScript Interfaces

| Entity | Interface Name | Description | Key Fields |
| :--- | :--- | :--- | :--- |
| **User** | `IUser` | Registered identity, preferences & metrics | `_id`, `name`, `email`, `streaks`, `pomodoros`, `preferences`, `subscription_tier`, `subscription_status` |
| **Space** | `ISpace` | Study space container | `_id`, `title`, `content`, `userId`, `summary`, `sourcesCount`, `isGuest` |
| **Source** | `ISource` | Uploaded document/link/text | `_id`, `type` (`text` \| `file_pdf` \| `link`), `name`, `file_url`, `text`, `spaceId`, `status` |
| **Quiz** | `IQuiz` | Multiple-choice quiz | `_id`, `userId`, `spaceId`, `questions` (`IQuizQuestion[]`) |
| **Flashcard** | `IFlashcard` | Single Q&A flashcard item | `_id`, `question`, `answer`, `spaceId`, `userId` |
| **Chat & Message** | `IChat`, `IMessage` | Conversation history | `chatId`, `spaceId`, `role` (`user` \| `assistant`), `content` |
| **Audio Explainer** | `IAudioExplainer` | TTS Concept Audio | `_id`, `spaceId`, `userId`, `concept`, `script`, `audioUrl`, `voiceId`, `status` |
| **Learning Path** | `ILearningPath` | Structured topic roadmap | `_id`, `spaceId`, `userId`, `topic`, `nodes` (`ILearningPathNode[]`) |
| **OTP Record** | `IOTPRecord` | Auth / Verification tokens | `email`, `code`, `type` (`email_verification` \| `password_reset`), `expiresAt` |

### 2.3 Quotas & Environment Configuration Matrix

The permissions and quotas engine operates in two modes governed by `APP_MODE`:

#### 1. Beta Mode (`APP_MODE=beta`)
In Beta preview mode, all registered users are mapped to generous preview quotas designed for feedback and performance testing.
- **Active Spaces**: 1 active space concurrently.
- **Chat Messages**: 20 messages per space lifetime (deleting space resets limit).
- **Practice Quizzes**: 1 quiz per day.
- **Flashcard Sets**: 20 flashcard generations per day.
- **Audio Explainers**: 1 audio explainer generation per day.
- **Learning Paths**: 2 learning paths per day.
- **File Upload Max**: 5 MB.

#### 2. Launch Mode (`APP_MODE=launch`)
In Launch mode, limits strictly enforce free tier vs PRO subscription tiers:

| Metric | Free Scholar Tier | Thinkly PRO Tier | Reset Window |
| :--- | :--- | :--- | :--- |
| **Active Spaces** | 3 Spaces | Unlimited (`Infinity`) | Total concurrent |
| **Daily AI Chat** | 25 msgs / day | Unlimited (`Infinity`) | Daily (UTC) |
| **Practice Quizzes** | 2 / day | Unlimited (`Infinity`) | Daily (UTC) |
| **Flashcards** | 2 / day | Unlimited (`Infinity`) | Daily (UTC) |
| **Audio Explainers** | 0 (Locked) | 10 / day | Daily (UTC) |
| **Learning Paths** | 0 (Locked) | Unlimited (`Infinity`) | Daily (UTC) |
| **Max File Upload** | 5 MB | 5 MB | Per file |

---

## 3. Server Architecture (`server/`)

### 3.1 Controller-Service Pattern & Directory Structure

```
server/src/
├── config/           # Environment variable validation & GenAI / AWS / Paystack SDK initializations
├── controllers/      # Route controllers (Request validation -> Service invocation -> DTO output)
├── middleware/       # Express middlewares (auth, guest, usageLimit, rateLimiter, validate, upload)
├── models/           # Mongoose schemas (User, UserUsage, UserBillingSubscription, Space, Source, etc.)
├── routes/           # Express router endpoints
├── services/         # Core business logic domain services
│   ├── audio/        # Fish Audio TTS provider integration
│   ├── content/      # Space management, document parsing, ingestion
│   ├── email/        # Email templates & providers (Resend / Gmail)
│   ├── identity/     # Authentication, session, OTP verification, streak tracking
│   ├── storage/      # S3 document & audio file storage
│   └── study/        # Quiz generation/evaluation & Flashcard generation
└── utils/            # AppError, catchAsync, JWT, logger, DB connection
```

### 3.2 Key Database Collections & Schemas

#### 1. `users` Collection (`User.ts`)
Stores identity, credentials, Google OAuth sub, activity streaks, Pomodoro metrics, user preferences, email verification status, and subscription tier (`free` | `premium`).

#### 2. `user_usages` Collection (`UserUsage.ts`)
Metered usage hub for daily & per-space atomic increments.
- Fields: `userId` (indexed), `feature` (indexed), `consumedAmount`, `periodStart` (Date), `spaceId` (optional, indexed for per-space features).
- Indexing: Compound unique index on `{ userId: 1, feature: 1, periodStart: 1, spaceId: 1 }`.

#### 3. `user_billing_subscriptions` Collection (`UserBillingSubscription.ts`)
Stores external payment provider contracts (Paystack / Stripe). Exists strictly for paid subscribers.
- Fields: `userId`, `provider` (`paystack`), `subscriptionId`, `customerCode`, `planCode`, `status`, `nextPaymentDate`.

### 3.3 Core Middleware Pipeline

1. `authenticateJWT`: Validates bearer tokens or HTTP-only auth cookies, populates `req.userId` and `req.user`.
2. `allowGuestOrAuth`: Resolves user identity from either JWT auth token or guest session cookie (`thinkly_guest_id`).
3. `restrictGuestAccess`: Blocks guest users from mutating operations (e.g. deleting spaces or updating account settings).
4. `checkFeatureAccess(feature)`: Validates whether the user's active tier (`PlanConfig.allowedFeatures`) permits access to the specified feature. Returns `403 Forbidden` if locked.
5. `checkMeteredLimit(feature)`: Evaluates current usage against plan limits. Performs an atomic MongoDB upsert (`$inc` / `$setOnInsert`) on `UserUsage`. Returns `403 Forbidden` with a clean error message if limit is exhausted.
6. `checkSpaceCreationLimit`: Counts active user spaces against `maxActiveSpaces`. Returns `403` if space limit reached.
7. `aiLimiter` / `rateLimiter`: Prevents API flooding and brute force attempts.
8. `validateRequest(schema)`: Validates `req.body`, `req.params`, or `req.query` using Zod schemas from `@thinkly/shared`.
9. `errorHandler`: Global Express error handling middleware. In production (`NODE_ENV=production`), stack traces are completely stripped and operational errors return sanitized JSON messages.

---

## 4. Backend API Reference

Base Endpoint URL: `/api`

### 4.1 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account. Initializes default `free` tier. Sends verification OTP email. |
| `POST` | `/api/auth/login` | Public | Authenticate email & password. Returns JWT token and sets auth cookie. |
| `POST` | `/api/auth/logout` | Authenticated | Clears auth token and destroys session. |
| `GET` | `/api/auth/me` | Authenticated | Fetches current user profile, streaks, pomodoros, and subscription tier. |
| `POST` | `/api/auth/verify-email` | Public | Verifies account using 6-digit OTP token or link token. |
| `POST` | `/api/auth/resend-verification` | Public | Resends account verification OTP. |
| `POST` | `/api/auth/forgot-password` | Public | Initiates password reset flow and sends reset OTP email. |
| `POST` | `/api/auth/reset-password` | Public | Resets user password using valid OTP token. |
| `GET` | `/api/auth/google` | Public | Initiates Google OAuth2 authentication flow. |
| `GET` | `/api/auth/google/callback` | Public | Google OAuth2 callback redirect handler. |

### 4.2 Spaces & AI Chat (`/api/spaces`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/spaces` | Authenticated | List all active study spaces for current user. |
| `GET` | `/api/spaces/:id` | Guest / Auth | Retrieve space details and overview summary. |
| `POST` | `/api/spaces/create` | Guest / Auth | Create a new study space. Checks `maxActiveSpaces` limit. |
| `POST` | `/api/spaces/chat` | Guest / Auth | Stream AI response for space chat. Metered by `checkMeteredLimit(AI_CHAT)`. |
| `GET` | `/api/spaces/:id/chat` | Guest / Auth | Retrieve paginated chat message history for space. |
| `PUT` | `/api/spaces/rename/:id` | Authenticated | Rename study space. |
| `DELETE` | `/api/spaces/delete/:id` | Authenticated | Permanently delete study space and cascade deletes space chat usage & sources. |

### 4.3 Sources & Document Ingestion (`/api/sources`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/sources/:spaceId` | Guest / Auth | List all ingested sources (PDFs, links, text) for space. |
| `POST` | `/api/sources/add` | Guest / Auth | Upload and parse document (PDF up to 5MB, URL link, or raw text). |
| `DELETE` | `/api/sources/delete/:id` | Authenticated | Remove source document from space. |

### 4.4 Study Tools (`/api/quizzes`, `/api/flashcards`, `/api/explainers`, `/api/learning-paths`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quizzes/:spaceId/generate` | Authenticated | Generate AI practice quiz. Metered by `GENERATE_QUIZ`. |
| `GET` | `/api/quizzes/:spaceId` | Authenticated | Get latest generated quiz for space. |
| `POST` | `/api/quizzes/:quizId/submit` | Authenticated | Submit quiz answers for evaluation and score calculation. |
| `POST` | `/api/flashcards/:spaceId/generate` | Guest / Auth | Generate flashcards set for space. Metered by `GENERATE_FLASHCARDS`. |
| `GET` | `/api/flashcards/:spaceId` | Guest / Auth | Get flashcard deck for space. |
| `DELETE` | `/api/flashcards/:spaceId` | Authenticated | Delete flashcard deck. |
| `POST` | `/api/explainers/space/:spaceId` | Authenticated | Generate TTS audio explainer script & audio file. Metered by `GENERATE_AUDIO`. |
| `GET` | `/api/explainers/space/:spaceId` | Authenticated | List generated audio explainers for space. |
| `DELETE` | `/api/explainers/:id` | Authenticated | Delete audio explainer. |
| `POST` | `/api/learning-paths/` | Guest / Auth | Generate learning path roadmap. Metered by `GENERATE_LEARNING_PATH`. |
| `GET` | `/api/learning-paths/` | Guest / Auth | List generated learning paths for space. |

### 4.5 Billing & Metered Limits (`/api/billing`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/billing/plan` | Authenticated | Returns current user plan configuration, allowed features, and granular `usagesMap`. |
| `POST` | `/api/billing/initialize` | Authenticated | Initialize Paystack checkout session for PRO subscription. |
| `POST` | `/api/billing/webhook` | Public | Paystack webhook handler for subscription creation, renewals, and cancellations. |

---

## 5. Frontend Architecture (`client/`)

### 5.1 Directory Structure & Layouts

```
client/src/
├── app/
│   ├── layouts/         # MainLayout (Dashboard sidebar/header), AuthLayout, LandingLayout
│   └── router/          # AppRoutes.tsx, config.tsx (React Router definitions)
├── components/
│   ├── auth/            # AuthPromptModal, LoginForm, RegisterForm
│   ├── billing/         # UpgradeModal
│   ├── dashboard/       # QuickActions, PracticeQuizModal, DashbordNavigation
│   ├── space/           # ChatInterface, ChatInput, ExplainerModal, LearningPathModal, ToolsSection
│   ├── spaces/          # SpaceMenu, NewSpaceButton
│   └── ui/              # BetaLimitModal, Button, Input, Modal, Sidebar
├── contexts/            # AuthContext, ThemeContext
├── hooks/
│   ├── queries/         # React Query custom hooks (useSpaces, useQuizzes, useExplainers, etc.)
│   ├── useAuth.ts       # Auth state hook
│   └── usePermissionsAndLimits.ts # Universal frontend permissions & metered limits engine
├── shared/
│   ├── services/        # Dedicated Axios API services (billingService, spaceService, etc.)
│   └── types/           # Client-specific UI types
└── pages/               # Composition-only page components (Dashboard, SpaceDetail, Settings, etc.)
```

### 5.2 React Query & Custom Hooks Architecture

- **`usePermissionsAndLimits`**: Central hook that queries `/api/billing/plan`. Exposes:
  - `canAccess(featureKey)`: Returns `boolean` indicating if feature is unlocked for tier.
  - `getLimitStatus(metric, spaceContext)`: Calculates `{ current, max, remaining, isReached, isLocked }` dynamically.
  - `triggerLimitModal(reason)`: Dispatches `thinkly:beta-limit-modal` or `thinkly:upgrade-modal` custom events based on `VITE_APP_MODE`.
- **`useChatHistory`**: Manages infinite paginated chat history for space.
- **`useSmoothStreaming`**: Delivers a fluid, typewriter-style text streaming animation for live AI chat responses.

### 5.3 UX Quota & Lock Enforcement Patterns

1. **Space Creation Safeguard**: `NewSpaceButton`, `QuickActions`, and `Sidebar` evaluate `getLimitStatus(ACTIVE_SPACES)`. If `isReached`, clicking opens the limit modal and prevents creation.
2. **Chat Exhaustion & Input Removal**: In `ChatInterface.tsx`:
   - If `chatLimitStatus.isReached` or `isForceLocked` (triggered upon backend `403`), the `<ChatInput />` component is permanently removed from the DOM for that session.
   - Replaced by a clean alert banner advising the user to delete the space and create a new one.
3. **Space Deletion Flow**: In `SpaceMenu.tsx`, clicking "Delete" closes the menu dropdown and triggers a clean, centred `Dialog` confirmation modal with a blurred backdrop.

---

## 6. Environment Variables Reference

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development # development | production
APP_MODE=beta        # beta | launch
MONGO_URI=mongodb://localhost:27017/thinkly
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# Optional AI & Integrations
GEMINI_API_KEY=your_gemini_api_key
FISH_AUDIO_API_KEY=your_fish_audio_api_key
PAYSTACK_SECRET_KEY=sk_test_xxx
AWS_S3_BUCKET=your_s3_bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
MAX_UPLOAD_SIZE_BYTES=5242880
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_MODE=beta # beta | launch
```

---

## 7. Developer Workflows & Build Commands

### 7.1 Development Setup
```bash
# Install dependencies across all workspaces
pnpm install

# Start client and server concurrently via Turborepo
pnpm dev
```

### 7.2 Building for Production
```bash
# Build shared package and all application targets
pnpm build

# Build specific workspace
pnpm --filter client build
pnpm --filter server build
```

---

## 8. Summary Checklist for New Feature Engineers

When adding a new feature or endpoint to Thinkly MVP:
1. [ ] Define data models, types, and Zod schemas in `packages/shared/src/`.
2. [ ] Add corresponding `FeatureFlag` and `MeteredMetric` enum values if the feature is metered.
3. [ ] Register quota rules in `BETA_PLAN_CONFIGS` and `LAUNCH_PLAN_CONFIGS` in `packages/shared/src/constants/plans.ts`.
4. [ ] Attach `checkFeatureAccess` and `checkMeteredLimit` middlewares to the Express route in `server/src/routes/`.
5. [ ] Route API calls on the client through dedicated service files in `client/src/shared/services/`.
6. [ ] Consume `usePermissionsAndLimits` in frontend modal/button components to show reactive quota feedback and trigger limit modals gracefully.
