import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../shared/services/authService";
import { toast } from "react-hot-toast";
import { AlertTriangle, X } from "lucide-react";

export const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show only for logged in signed up users (not guests) whose email is unverified
  if (!user || user.isGuest || user.isEmailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    try {
      setIsResending(true);
      await authService.resendVerification(user.email);
      toast.success("Verification link sent! Please check your inbox.");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to send verification email";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 sm:px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2 shrink-0 z-40">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="font-semibold text-amber-700 dark:text-amber-300 shrink-0">
          Action Required:
        </span>
        <span className="truncate hidden md:inline">
          Please verify your email address to ensure full account security and features.
        </span>
        <span className="truncate md:hidden">
          Please verify your email address.
        </span>
      </div>
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="font-semibold text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 whitespace-nowrap cursor-pointer"
        >
          {isResending ? "Sending..." : "Resend Link"}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700 dark:text-amber-400 hover:opacity-75 p-0.5 rounded cursor-pointer"
          title="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
