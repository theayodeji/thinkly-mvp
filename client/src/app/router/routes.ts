export const routes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  dashboard: "/dashboard",
  Spaces: {
    root: "/spaces",
    Space: (id: string) => `/spaces/${id}`,
  },
  inDevelopment: "/in-development",
} as const;
