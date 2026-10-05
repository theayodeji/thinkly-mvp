import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { routeConfig } from "./config";
import type { RouteConfig } from "../../shared/types/route";
import { useAuth } from "../../hooks/useAuth";

const AppRouter = () => {
  const { user, loading } = useAuth();

  const wrappedRoutes = React.useMemo(() => {
    const wrapRoutes = (routes: RouteConfig[]): RouteConfig[] =>
      routes.map((r) => {
        if (r.children) {
          return {
            ...r,
            children: wrapRoutes(r.children),
          };
        }
        return {
          ...r,
          element:
            r.protected ? (
              loading ? null : !user ? <Navigate to="/auth/login" /> : r.element
            ) : r.element,
        };
      });
    return wrapRoutes(routeConfig);
  }, [user, loading]);

  return useRoutes(wrappedRoutes);
};

export function AppRoutes() {
  return <AppRouter />;
}
