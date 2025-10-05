import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
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
    // if (error.code === "ERR_NETWORK") {
    //   toast.error("Network error, please try again");
    // }
    if (error.code === "ERR_BAD_RESPONSE") {
      toast.error("Something's wrong but its not your fault");
    }
    
    return Promise.reject(error);
  }
);

