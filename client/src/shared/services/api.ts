import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getOrCreateGuestDeviceId } from "../utils/guest";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: Attach Guest Device ID
api.interceptors.request.use((config) => {
  const guestDeviceId = getOrCreateGuestDeviceId();
  if (guestDeviceId) {
    config.headers["X-Guest-Device-Id"] = guestDeviceId;
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

    // Account Limit Reached (403)
    if (error.response?.status === 403) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Limit reached.";

      if (isLaunchMode) {
        // Full Launch Mode: Open Paystack Upgrade Modal
        const customEvent = new CustomEvent("thinkly:upgrade-modal", {
          detail: { reason: errorMsg },
        });
        window.dispatchEvent(customEvent);
      } else {
        // Beta Mode: Show clean Toast notification informing user higher limits are coming soon
        toast.error(errorMsg);
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        await api.post("/auth/refresh-token");

        // Retry the original request if refresh is successful
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);
