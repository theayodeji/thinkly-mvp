import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { api, AxiosErrorWithResponse } from "../shared/services/api";
import type { User, AuthContextType } from "../shared/types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await api.get("/auth/me").then(response => response.data);
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoggingIn(true);
    try {
      const { data: { user } } = await api.post("/auth/register", { email, password, name });
      setUser(user);
      toast.success("Registered successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorWithResponse;
      toast.error(axiosError.response?.data.message || "Registration failed");
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoggingIn(true);
    try {
      const { data: { user} } = await api.post("/auth/login", { email, password });
      setUser(user);
      toast.success("Logged in successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorWithResponse;
      toast.error(axiosError.response?.data.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    toast.success("Logged out successfully");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isLoggingIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
