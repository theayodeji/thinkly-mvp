import React, { useState } from "react";
import { Mail, Shield, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { authService } from "../../shared/services/authService";
import { toast } from "react-hot-toast";

interface SecuritySectionProps {
  userEmail?: string;
  onLogoutAll: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  userEmail,
  onLogoutAll,
}) => {
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  const handleSendResetEmail = async () => {
    if (!userEmail) {
      toast.error("Email address not found.");
      return;
    }
    try {
      setIsSendingResetEmail(true);
      await authService.forgotPassword(userEmail);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to send reset email";
      toast.error(msg);
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-danger mb-4 border-b border-danger/20 pb-2">
        Security & Password
      </h2>

      {/* Password Reset Via Link Card */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Change Password
            </h3>
            <p className="text-xs text-text-secondary">
              Password updates are authorized via email verification for maximum
              account security.
            </p>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed pl-12">
          We will dispatch a secure password reset link to your registered
          address:{" "}
          <strong className="text-text-primary font-semibold">
            {userEmail}
          </strong>
          .
        </p>

        <div className="pl-12 pt-1">
          <Button
            type="button"
            variant="dark"
            onClick={handleSendResetEmail}
            loading={isSendingResetEmail}
            className=""
          >
            <Mail className="w-4 h-4" />
            Send Password Reset Email
          </Button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="pt-4 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={onLogoutAll}
          className="w-full sm:w-auto border-danger text-danger hover:bg-danger/10 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log out of all devices
        </Button>
      </div>
    </section>
  );
};
