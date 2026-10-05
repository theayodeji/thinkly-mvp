import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/ui/TextInput";
import { Button } from "../../components/ui/Button";
import { OTPInput } from "../../components/ui/OTPInput";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../../shared/services/authService";
import { OTPType } from "@thinkly/shared";
import { toast } from "react-hot-toast";

const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: emailParam },
  });

  const emailValue = watch("email");

  const handleResendOTP = async () => {
    if (!emailValue) {
      toast.error("Please enter your email address");
      return;
    }
    try {
      setIsResending(true);
      await authService.sendOTP(emailValue, OTPType.PASSWORD_RESET);
      toast.success("A new verification code has been sent!");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to resend code";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: data.email,
        otp,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully. Please login.");
      navigate("/auth/login");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Password reset failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen min-h-[550px] p-8 md:p-2 flex items-center justify-center">
      <div className="md:w-1/2 w-full max-w-md flex flex-col justify-center items-center glass-panel p-8 rounded-xl shadow-lg border border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-sm text-text-secondary mb-6 text-center">
          Enter your 6-digit verification code and your new password.
        </p>

        <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            className="py-2"
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Verification Code</label>
            <OTPInput value={otp} onChange={setOtp} disabled={isLoading} />
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending || isLoading}
                className="text-xs text-primary-500 hover:underline"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </div>
          </div>

          <TextInput
            label="New Password"
            type="password"
            className="py-2"
            placeholder="••••••••"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />

          <TextInput
            label="Confirm Password"
            type="password"
            className="py-2"
            placeholder="••••••••"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Button
            className="w-full mt-4"
            variant="primary"
            size="md"
            type="submit"
            loading={isLoading}
            disabled={isLoading || otp.length !== 6 || !!errors.newPassword || !!errors.confirmPassword}
          >
            Reset Password
          </Button>

          <div className="w-full flex justify-center mt-4">
            <Link to="/auth/login" className="text-sm text-primary-500 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
