import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/ui/TextInput";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { api } from "../../shared/services/api";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen min-h-[500px] p-8 md:p-2 flex items-center justify-center">
      <div className="md:w-1/2 w-full max-w-md flex flex-col justify-center items-center glass-panel p-8 rounded-xl shadow-lg border border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>

        {isSuccess ? (
          <div className="text-center">
            <p className="text-green-600 dark:text-green-400 font-medium mb-4">
              If an account exists, a reset link was sent to your email.
            </p>
            <Link
              to="/auth/login"
              className="underline text-primary-500 hover:text-primary-600"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-secondary mb-6 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form
              className="w-full space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                label="Email"
                placeholder="your@email.com"
                className="py-2"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
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
                disabled={isLoading || !!errors.email}
              >
                Send Reset Link
              </Button>

              <div className="w-full flex justify-center mt-6">
                <Link
                  to="/auth/login"
                  className="text-sm text-primary-500 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
