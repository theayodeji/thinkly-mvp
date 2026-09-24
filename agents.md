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
