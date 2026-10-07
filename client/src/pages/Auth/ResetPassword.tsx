import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/ui/TextInput";
import { Button } from "../../components/ui/Button";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../../shared/services/authService";
import { toast } from "react-hot-toast";

const resetPasswordSchema = z
  .object({
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
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState<"checking" | "valid" | "invalid">("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setErrorMessage("No reset token provided. Please click the link in your password reset email.");
      return;
    }

    const checkToken = async () => {
      try {
        await authService.verifyResetToken(token);
        setStatus("valid");
      } catch (err: any) {
        const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Password reset link is invalid or has expired.";
        setStatus("invalid");
        setErrorMessage(msg);
      }
    };

    checkToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (!token) return;

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully. Please log in.");
      navigate("/auth/login");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to update password.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen min-h-[550px] p-8 md:p-2 flex items-center justify-center">
      <div className="md:w-1/2 w-full max-w-md flex flex-col justify-center items-center glass-panel p-8 rounded-2xl shadow-lg border border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md">
        {status === "checking" && (
          <div className="py-8 space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h1 className="text-xl font-bold">Checking reset link...</h1>
          </div>
        )}

        {status === "invalid" && (
          <div className="py-6 space-y-6 text-center w-full">
            <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <div>
              <h1 className="text-2xl font-bold text-danger">Invalid or Expired Link</h1>
              <p className="text-sm text-text-secondary mt-2">{errorMessage}</p>
            </div>

            <div className="space-y-3 w-full">
              <Button className="w-full py-2.5" onClick={() => navigate("/auth/forgot-password")}>
                Request New Password Reset Link
              </Button>
              <Link to="/auth/login" className="block text-sm text-primary-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {status === "valid" && (
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-2 text-center">Set New Password</h1>
            <p className="text-sm text-text-secondary mb-6 text-center">
              Enter your new password below to update your account security.
            </p>

            <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                label="New Password"
                type="password"
                className="py-2"
                placeholder="••••••••"
                {...register("newPassword")}
                error={errors.newPassword?.message}
              />

              <TextInput
                label="Confirm New Password"
                type="password"
                className="py-2"
                placeholder="••••••••"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />

              <Button
                className="w-full mt-4 py-2.5"
                variant="primary"
                type="submit"
                loading={isLoading}
              >
                Update Password
              </Button>

              <div className="w-full flex justify-center mt-4">
                <Link to="/auth/login" className="text-sm text-primary-500 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
