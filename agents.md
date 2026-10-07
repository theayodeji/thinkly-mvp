# Agent Instructions for thinkly-mvp

When working in this codebase, you must adhere to the following architectural rules and principles. Violating these rules breaks the structural integrity of the application.

## 1. Monorepo Structure & Package Manager
- This is a monorepo utilizing **pnpm workspaces** and **Turborepo**.
- **Never use `npm install` or `yarn`**. Always use `pnpm`.
- The workspace consists of three main parts:
  - `client/`: Vite React application.
  - `server/`: Express + Node.js backend.
  - `packages/shared/`: Shared TypeScript types, interfaces, and Zod schemas.

## 2. Shared Types & Contracts (`@thinkly/shared`)
- **Single Source of Truth**: All data models, API request/response shapes, and enumerations MUST be defined in `packages/shared`.
- **Pure TypeScript**: Do not import Mongoose or other server/client-specific libraries in the shared package. Use primitive types (`string` instead of `ObjectId`) for cross-boundary data.
- **Zod Schemas**: Both the client and server must use the Zod schemas defined in `packages/shared` for validation.
- **Module Resolution**: The shared package is compiled as an ES Module (`NodeNext`). Explicitly use `.js` extensions for local imports within `packages/shared/src/` (e.g., `import { SourceType } from "./types.js";`).

## 3. Server Architecture Rules
- **Service Layer Boundary**: Controllers must NOT contain direct database queries (Mongoose) or business logic orchestrations. Controllers are strictly for:
  - Extracting request data.
  - Calling a dedicated service in `src/services/`.
  - Formatting the response.
- **Request Validation**: Use Zod middleware (`packages/shared` schemas) on all API routes before they hit the controller.
- **Transactions**: Use the provided `withMongoTransaction` utility for multi-step operations.
- **Auth Ownership**: Token creation, cookie policies, and streak updates should be centralized and not spread across disparate middleware and utils.

## 4. Client Architecture Rules
- **API Boundary Validation**: Do not blindly trust API responses using generic casting (e.g., `as Note`). Parse incoming data using Zod schemas from `@thinkly/shared`.
- **State Management**: Use React Query (`@tanstack/react-query`) for remote server state. Use Zustand strictly for local client UI state.
- **Service Layer**: Components and custom hooks must never make raw Axios calls. Route all API calls through dedicated services in `src/shared/services`.
- **Custom Hooks**: Use shared custom hooks for common behaviors (e.g., `useDebounce`, `useLocalStorage`, `useDisclosure`).

## 5. Development Workflow
- We use **Turborepo** for task orchestration.
- Run `pnpm dev` at the root to start the client and server simultaneously.
- Client and server consume the raw `.ts` files from `packages/shared` directly using explicit exports and native ES module resolution.

## 6. Agile Team Workflow & Subagents
We operate using an autonomous multi-agent architecture managed by a lead Architect agent.

- **The Architect**: Ascertains requirements, plans schema and code changes, discusses architecture decisions, identifies inefficiencies, relays QA feedback, and coordinates specialized subagents. No major structural changes or database migrations are performed without express permission from the human user.
- **Frontend Agent (`frontend_developer`)**: Responsible for writing and maintaining React/Vite code, UI components, Zustand state, and React Query integration. **Strict Boundary:** May read any file, but can ONLY write to `client/` and `packages/shared/`.
- **Backend Agent (`backend_developer`)**: Responsible for Node.js, Express, MongoDB, and maintaining Zod schemas. **Strict Boundary:** May read any file, but can ONLY write to `server/` (excluding test files) and `packages/shared/`.
- **QA Agent (`qa_engineer`)**: Responsible for rigorous testing (Jest / React Testing Library), edge-case identification, verifying features, and reviewing code before any merges. **Strict Boundary:** May read any file, but can ONLY write to test files (e.g. `*.test.ts`, `tests/` directories).

**Branching & Environment Strategy:**
1. **Single Source of Truth (`main`):** All new features, bug fixes, and development land on `main`. We do NOT maintain long-lived divergent application code across different branches.
2. **Feature Branches:** Short-lived feature branches (e.g., `feature/user-auth`) branch off `main` and merge back into `main` after verification.
3. **Environment-Driven Configuration:**
   - **Staging / Render Beta:** Deploys `main` (or a synced `staging` branch) with `APP_MODE=beta`.
   - **Production / Launch:** Deploys `main` with `APP_MODE=launch`.
   - Differences between environments (e.g., generous beta limits vs. tiered pricing limits) are controlled purely via environment configuration (`packages/shared/src/constants/plans.ts`), not divergent code bases.
