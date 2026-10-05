import React, { useState, useEffect } from "react";
import { OTPInput } from "../ui/OTPInput";
import { Button } from "../ui/Button";
import { authService } from "../../shared/services/authService";
import { OTPType } from "@thinkly/shared";
import toast from "react-hot-toast";

interface OTPVerificationModalProps {
  isOpen: boolean;
  email: string;
  type: OTPType;
  title?: string;
  description?: string;
  onVerify: (otp: string) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  email,
  type,
  title = "Verify Email Address",
  description = "Enter the 6-digit verification code sent to your email.",
  onVerify,
  onClose,
  isLoading = false,
}) => {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  if (!isOpen) return null;

  const handleResend = async () => {
    try {
      setIsResending(true);
      await authService.sendOTP(email, type);
      toast.success("A new verification code has been sent!");
      setResendTimer(60);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to resend code";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    onVerify(otp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 bg-background border border-border rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-2 text-xl"
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-text-secondary mt-1">{description}</p>
          <p className="text-xs font-semibold text-primary-500 mt-1">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <OTPInput value={otp} onChange={setOtp} disabled={isLoading} />

          <Button
            type="submit"
            className="w-full"
            variant="primary"
            size="md"
            loading={isLoading}
            disabled={otp.length !== 6 || isLoading}
          >
            Verify Code
          </Button>

          <div className="text-center text-sm text-text-secondary">
            {resendTimer > 0 ? (
              <span>Resend code in <strong className="text-text-primary">{resendTimer}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || isLoading}
                className="underline text-primary-500 font-semibold hover:text-primary-600 transition-colors"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
