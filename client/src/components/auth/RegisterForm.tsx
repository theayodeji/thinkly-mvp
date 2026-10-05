import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchema } from "../../shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuthButton";
import { OTPVerificationModal } from "./OTPVerificationModal";
import { authService } from "../../shared/services/authService";
import { OTPType } from "@thinkly/shared";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const { register: registerUser, isLoggingIn } = useAuth();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<RegisterSchema | null>(null);

  const onSubmitForm = async (data: RegisterSchema) => {
    try {
      setIsSendingOtp(true);
      setPendingFormData(data);
      await authService.sendOTP(data.email, OTPType.EMAIL_VERIFICATION);
      toast.success("Verification code sent to your email!");
      setShowOtpModal(true);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to send verification code";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!pendingFormData) return;
    try {
      await registerUser(
        pendingFormData.email,
        pendingFormData.password,
        pendingFormData.name,
        otp
      );
      setShowOtpModal(false);
    } catch (err: any) {
      // Error handled by AuthContext toast
    }
  };

  return (
    <div className="md:w-2/3 w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Hello <span className="text-primary-500">Scholar</span>!</h1>
      <p className="text-sm text-text-secondary mb-4">
        Register to create an account
      </p>
      <form
        className="w-full max-w-md space-y-2.5"
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <TextInput
          label="Name"
          placeholder="What's your name?"
          className="py-2"
          autoComplete="name"
          {...register("name")}
          error={errors.name?.message}
        />
        <TextInput
          label="Email"
          placeholder="your@email.com"
          className="py-2"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <TextInput
          label="Password"
          type="password"
          className="py-2"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />
        <TextInput
          label="Confirm Password"
          type="password"
          className="py-2"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button
          className="w-full"
          variant="primary"
          size="md"
          type="submit"
          loading={isSendingOtp}
          disabled={isSendingOtp || !!errors.email || !!errors.password || !!errors.confirmPassword}
        >
          Register
        </Button>

        <div className="w-full flex flex-col items-start mt-2">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="underline text-primary-500">
              Login
            </Link>
          </p>
        </div>
      </form>
      <p className="text-sm mt-4">OR</p>
      <GoogleAuthButton />

      {pendingFormData && (
        <OTPVerificationModal
          isOpen={showOtpModal}
          email={pendingFormData.email}
          type={OTPType.EMAIL_VERIFICATION}
          title="Verify Your Email"
          description="Enter the 6-digit code sent to your email to complete registration."
          onVerify={handleVerifyOtp}
          onClose={() => setShowOtpModal(false)}
          isLoading={isLoggingIn}
        />
      )}
    </div>
  );
};

export default RegisterForm;
