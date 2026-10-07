export const routes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",
  },
  dashboard: "/dashboard",
  Spaces: {
    root: "/spaces",
    Space: (id: string) => `/spaces/${id}`,
  },
  inDevelopment: "/in-development",
  settings: "/settings",
} as const;
