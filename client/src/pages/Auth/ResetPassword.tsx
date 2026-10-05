import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/ui/TextInput";
import { Button } from "../../components/ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../shared/services/api";
import { toast } from "react-hot-toast";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully. Please login.");
      navigate("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen min-h-[500px] p-8 md:p-2 flex items-center justify-center">
      <div className="md:w-1/2 w-full max-w-md flex flex-col justify-center items-center glass-panel p-8 rounded-xl shadow-lg border border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>

        <p className="text-sm text-text-secondary mb-6 text-center">
          Enter your new password below.
        </p>

        {error && !token ? (
          <div className="text-center w-full">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <Button
              className="w-full mt-2"
              variant="dark"
              onClick={() => navigate("/auth/login")}
            >
              Back to Login
            </Button>
          </div>
        ) : (
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
              label="Confirm Password"
              type="password"
              className="py-2"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              className="w-full mt-4"
              variant="primary"
              size="md"
              type="submit"
              loading={isLoading}
              disabled={
                isLoading || !!errors.newPassword || !!errors.confirmPassword
              }
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
