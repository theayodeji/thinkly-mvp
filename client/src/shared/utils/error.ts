import axios, { AxiosError } from "axios";
import { AxiosErrorWithResponse } from "../services/api";

/**
 * Safely extracts a meaningful error message from an unknown error object.
 * Prevents runtime crashes when errors are not of type AxiosError.
 */
export const getErrorMessage = (error: unknown, defaultMessage = "An unexpected error occurred"): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<AxiosErrorWithResponse>;
    return axiosError.response?.data?.message || axiosError.message || defaultMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};
