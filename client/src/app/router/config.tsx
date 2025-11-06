import { routes } from "./routes";
import type { RouteConfig } from "../../shared/types/route";

// layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// pages
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Dashboard from "../../pages/Dashboard";
import NotesList from "../../pages/NotesList";
import NoteDetail from "../../pages/NoteDetail";
import Home from "../../pages/Home";
import InDevelopment from "../../pages/InDevelopment";

export const routeConfig: RouteConfig[] = [
  {
    element: <MainLayout />,
    children: [
      { path: routes.home, element: <Home />, protected: false },
      { path: routes.inDevelopment, element: <InDevelopment />, protected: false },
      { path: routes.dashboard, element: <Dashboard />, protected: true, },
      { path: routes.notes.root, element: <NotesList />, protected: true },
      {
        path: routes.notes.note(":id"),
        element: <NoteDetail />,
        protected: true,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: routes.auth.login, element: <Login />, protected: false },
      { path: routes.auth.register, element: <Register />, protected: false },
    ],
  },
];
