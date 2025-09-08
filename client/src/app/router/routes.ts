export const routes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  dashboard: "/dashboard",
  notes: {
    root: "/notes",
    note: (id: string) => `/notes/${id}`,
  },
} as const;
