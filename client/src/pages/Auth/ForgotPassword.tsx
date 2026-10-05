import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/ui/TextInput";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../shared/services/authService";
import { OTPType } from "@thinkly/shared";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      await authService.sendOTP(data.email, OTPType.PASSWORD_RESET);
      toast.success("Verification code sent to your email!");
      navigate(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen min-h-[500px] p-8 md:p-2 flex items-center justify-center">
      <div className="md:w-1/2 w-full max-w-md flex flex-col justify-center items-center glass-panel p-8 rounded-xl shadow-lg border border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-sm text-text-secondary mb-6 text-center">
          Enter your email address to receive a 6-digit verification code.
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
            className="w-full mt-4"
            variant="primary"
            size="md"
            type="submit"
            loading={isLoading}
            disabled={isLoading || !!errors.email}
          >
            Send Verification Code
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
      </div>
    </div>
  );
};

export default ForgotPassword;
