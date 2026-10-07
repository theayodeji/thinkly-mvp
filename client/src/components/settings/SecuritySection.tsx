import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { authService } from "../../shared/services/authService";
import { toast } from "react-hot-toast";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

interface SecuritySectionProps {
  userEmail?: string;
  onLogoutAll: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  userEmail,
  onLogoutAll,
}) => {
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePasswordSubmit = async (data: ChangePasswordSchema) => {
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      reset();
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to change password";
      toast.error(msg);
    }
  };

  const handleSendResetEmail = async () => {
    if (!userEmail) return;
    try {
      setIsSendingResetEmail(true);
      await authService.forgotPassword(userEmail);
      toast.success("Password reset email sent! Check your inbox.");
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
        Security
      </h2>

      {/* Change Password Form */}
      <form onSubmit={handleSubmit(onChangePasswordSubmit)} className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Change Password</h3>

        <TextInput
          label="Current Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("currentPassword")}
          error={errors.currentPassword?.message}
        />

        <TextInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />

        <TextInput
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Update Password
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleSendResetEmail}
            loading={isSendingResetEmail}
          >
            Send Reset Email
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={onLogoutAll}
          className="w-full sm:w-auto border-danger text-danger hover:bg-danger/10"
        >
          Log out of all devices
        </Button>
      </div>
    </section>
  );
};
