import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../shared/services/authService";
import { toast } from "react-hot-toast";

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
      await authService.resendVerification();
      toast.success("Verification link sent! Please check your inbox.");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to send verification email";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-2 z-40">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-amber-600 dark:text-amber-400">⚠️ Action Required:</span>
        <span>Please verify your email address to ensure full account security and features.</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="font-semibold text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50"
        >
          {isResending ? "Sending Link..." : "Resend Link"}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700 dark:text-amber-400 hover:opacity-75 font-bold"
          title="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
