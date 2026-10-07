import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/ui/TextInput";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { authService } from "../../shared/services/authService";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSentEmail(data.email);
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email!");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen min-h-[500px] p-8 md:p-2 flex items-center justify-center">
      <div className="md:w-1/2 w-full max-w-md flex flex-col justify-center items-center glass-panel p-8 rounded-2xl shadow-lg border border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md">
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✉
            </div>
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="text-sm text-text-secondary">
              If an account with <span className="font-semibold text-text-primary">{sentEmail}</span> exists, we've sent a link to reset your password.
            </p>
            <div className="pt-4">
              <Link to="/auth/login" className="text-sm text-primary-500 hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
            <p className="text-sm text-text-secondary mb-6 text-center">
              Enter your email address to receive a secure link to reset your password.
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

              <Button
                className="w-full mt-4 py-2.5"
                variant="primary"
                type="submit"
                loading={isLoading}
                disabled={isLoading || !!errors.email}
              >
                Send Reset Link
              </Button>

              <div className="w-full flex justify-center mt-6">
                <Link to="/auth/login" className="text-sm text-primary-500 hover:underline">
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
