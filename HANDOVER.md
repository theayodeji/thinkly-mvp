# Thinkly MVP - Handover Notes (V1 to V2)

Welcome! You are taking over the Thinkly MVP codebase. We have just completed the "V1 Smart Tutor" milestone and are shifting gears toward production readiness, monetization, and launch restrictions.

## 🏗️ Current Architecture & State
- **Monorepo:** Turborepo with `client/` (React/Vite/Zustand/React Query), `server/` (Node/Express/MongoDB), and `packages/shared/` (Zod schemas, types, constants).
- **Package Manager:** `pnpm` (Workspace). **Do not use npm/yarn.**
- **Authentication:** Fully custom JWT implementation with HTTP-only cookies. Google OAuth is also fully functional and maps to our backend callback.
- **Design System:** "Liquid Glass" aesthetic using Tailwind CSS. Core components are in `client/src/components/ui`. Dark/Light mode is fully functional and synced to the database via User Preferences.
- **Features Completed:** Space creation, PDF parsing, Gemini AI Learning Paths (visual roadmap), Quizzes, and Audio Explainers (using Fish Audio).
- **Email Infrastructure:** We built an Adapter pattern in `server/src/services/email/EmailService.ts` supporting both Resend and Gmail (Nodemailer). It currently sends raw HTML strings.

## 🚀 Your Objectives (The V2 Scope)

### 1. Upgrade to React Email
The current `EmailService.ts` relies on injecting variables into hardcoded HTML template strings. 
- **Task:** Install and integrate [React Email](https://react.email/) to build beautiful, responsive email templates.
- **Implementation:** Create a `packages/emails/` or `server/src/emails/` directory. Build templates for `ResetPassword`, `Welcome`, and `WeeklyQuizPromo`. Update the Adapter to compile these React components to HTML before sending.

### 2. Implement Beta Restrictions (Usage Limits)
We need to lock down the beta to prevent abuse and LLM cost-overruns before the paywall is active.
- **Task:** Implement usage caps in the backend. 
- **Requirements:** 
  - Limit the number of active `Spaces` a free user can create (e.g., 3).
  - Limit the number of AI generations (Audio Explainers, Quizzes, Learning Paths) per day (e.g., 5 AI actions/day).
  - Track these metrics either in Redis or directly on the `User` document in MongoDB.

### 3. Build the Paywall (Paystack Integration)
To unlock the restrictions, users will need to upgrade to a PRO tier. Since the business is operating out of Nigeria, we are using **Paystack** to easily accept both local (NGN) and international payments.
- **Task:** Integrate Paystack for subscriptions.
- **Requirements:**
  - Add a `plan` or `isPro` flag to the `User` schema in `@thinkly/shared` and MongoDB.
  - Build a `/api/billing/initialize` endpoint to generate Paystack Checkout URLs.
  - Build a secure Paystack Webhook endpoint `/api/billing/webhook` to listen for `charge.success` and subscription events to toggle the user's PRO status. Ensure you verify the webhook signature using the Paystack secret key.
  - Build a frontend Pricing/Upgrade Modal that redirects to the Paystack checkout.

## ⚠️ Important Rules to Remember
- **Shared Types:** ALWAYS update `packages/shared/src/types.ts` and `schemas.ts` when modifying the DB schema. Never create isolated interfaces in the client or server.
- **Validation:** All backend endpoints must validate incoming requests against `@thinkly/shared` Zod schemas using our validation middleware.
- **Routing:** Do not use `useRoutes` in React without `useMemo` (we patched a memory leak where context updates destroyed the DOM tree). 
- **CSS Performance:** Avoid `backdrop-blur` on massive full-screen animating elements or over fixed CSS gradients, as it chokes GPU rendering on mobile. 

Good luck! You've got a solid, production-ready foundation to build on.
