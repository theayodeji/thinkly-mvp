import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getOrCreateGuestDeviceId } from "../utils/guest";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true,
});

// Request interceptor: Attach Guest Device ID and set Content-Type
api.interceptors.request.use((config) => {
  const guestDeviceId = getOrCreateGuestDeviceId();
  if (guestDeviceId) {
    config.headers["X-Guest-Device-Id"] = guestDeviceId;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Defined error type
export interface AxiosErrorWithResponse extends AxiosError {
  response: AxiosResponse;
  config: InternalAxiosRequestConfig & { _retry?: boolean };
}

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosErrorWithResponse) => {
    const originalRequest = error.config;
    const isLaunchMode = import.meta.env.VITE_APP_MODE === "launch";
    const requestUrl = originalRequest?.url || "";

    // Guest Auth / Limit Reached Prompt Trigger
    const errorCode = error.response?.data?.code;
    if (errorCode === "GUEST_LIMIT_REACHED" || errorCode === "GUEST_AUTH_REQUIRED") {
      const customEvent = new CustomEvent("thinkly:auth-prompt-modal", {
        detail: {
          reason: error.response?.data?.error || "Sign in or register to continue learning on Thinkly.",
          limitType: error.response?.data?.limitType,
        },
      });
      window.dispatchEvent(customEvent);
      return Promise.reject(error);
    }

    const errorMsg = error.response?.data?.error || error.response?.data?.message || "";
    const isTokenOrAuthError =
      errorMsg.toLowerCase().includes("token") ||
      errorMsg.toLowerCase().includes("unauthorized") ||
      requestUrl.includes("/auth/");

    // Account Limit Reached (403) - ignore token/auth 403s
    if (error.response?.status === 403 && !isTokenOrAuthError) {
      const customEvent = new CustomEvent("thinkly:upgrade-modal", {
        detail: { reason: errorMsg || "Limit reached. Upgrade to unlock full access!" },
      });
      window.dispatchEvent(customEvent);
      return Promise.reject(error);
    }

    // Do not attempt token refresh for auth endpoints or if already retried
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh-token") ||
      requestUrl.includes("/auth/me");

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        await api.post("/auth/refresh-token");

        // Retry the original request if refresh is successful
        return api(originalRequest);
      } catch (refreshError) {
        // Silent catch: token refresh failed for non-auth endpoint
      }
    }

    return Promise.reject(error);
  }
);
