# Client Architecture Review & Roadmap

This document consolidates the findings and recommendations from our 4-part scan of the `client` directory.

## Run 1: Architecture & Folder Structure Analysis
*   **State Management Fragmentation:** The app mixes React Context (Auth, Pomodoro, Theme) with Zustand stores (Notes, Quizzes, Flashcards, Chat).
    *   *Recommendation:* Unify global state management to reduce provider wrapping and create a single source of truth.
*   **Service Layer Inconsistency:** Only some entities (Notes, Cloudinary) have extracted API services in `src/shared/services`. Other API calls are made directly inside stores/components.
    *   *Recommendation:* Create a uniform API service layer for all entities (e.g., `quizService.ts`) mirroring the backend.
*   **Folder Structure & Feature Separation:** The `components` folder contains redundant groupings (`note` vs `notes`) and mixes layer-based with feature-based organization. The `app` directory contains `layouts` and `router` which is non-standard for Vite.
    *   *Recommendation:* Consolidate redundant folders, and move layouts/routers to standard top-level `src/layouts` and `src/routes` directories.

## Run 2: Code Modularization & Hooks Analysis
*   **Local Storage Management:** Both `ThemeContext.tsx` and `AuthContext.tsx` manually interact with `localStorage`.
    *   *Recommendation:* Extract a generic `useLocalStorage<T>` hook to encapsulate parsing and cross-tab syncing.
*   **Modal and Drawer Toggles:** Multiple components manually manage `const [open, setOpen] = useState(false)` with toggle functions.
    *   *Recommendation:* Introduce a reusable `useDisclosure()` hook.
*   **Input Debouncing:** `SearchBar.tsx` manually manages a `setTimeout` debouncer.
    *   *Recommendation:* Extract a generic `useDebounce(value, delay)` hook to prevent spamming queries.
*   **Async State Boilerplate:** Numerous files manually manage `loading` and `error` states for asynchronous operations.
    *   *Recommendation:* Transitioning to React Query will natively solve this.

## Run 3: Runtime Errors & Type Validations
*   **Unsafe Axios Error Assertions:** Errors caught in `try/catch` are forcefully cast to `AxiosError<AxiosErrorWithResponse>`. Non-Axios errors will crash the app when `err.response` is accessed.
    *   *Recommendation:* Create a safe error handler utility that checks `axios.isAxiosError(error)` before extracting data.
*   **Unsafe `any` Typecasting in PDF Parsing:** `usePdfExtraction.ts` uses `textContent.items.map((item: any) => item.str)`.
    *   *Recommendation:* Use a proper interface and a runtime check (`if ('str' in item)`) to prevent undefined property errors.
*   **Blind Trust of API Responses:** Generics are used to cast responses (e.g. `api.get<{ notes: Note[] }>`), meaning downstream code expects a perfect shape even if the backend changes.
    *   *Recommendation:* Implement Zod schema validation at the API boundary to parse and validate incoming responses.
*   **Incomplete Form Validation:** Forms like "Add Source" or "Rename Note" lack the strict Zod validation applied to the Auth forms.
    *   *Recommendation:* Expand Zod usage to all forms and user inputs.

## Run 4: Test Points & Production Considerations
*   **React Query Migration:**
    *   Define standardized query keys (`['notes', 'list']`, etc.) for flawless cache invalidation.
    *   Configure sensible `staleTime` defaults to prevent unnecessary re-fetching.
*   **Testing Strategy:**
    *   Unit test the new utility hooks (`useLocalStorage`, `useDebounce`).
    *   Test custom React Query hooks by wrapping them in a test `QueryClientProvider`.
    *   Use React Testing Library for form validation tests, and Playwright/Cypress for full critical path E2E tests.
*   **Error Boundaries & Fallbacks:** The app currently lacks a global Error Boundary. Implement one to prevent white-screen crashes, and leverage React Query's `useQueryErrorResetBoundary` for retry mechanisms.
*   **Build Optimization & Validation:** Split vendor dependencies (React Query, Zod, PDF.js) into separate chunks in `vite.config.ts`. Validate `import.meta.env` at boot time using Zod.
