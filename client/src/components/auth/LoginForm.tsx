import React from "react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../../validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuthButton";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { login, isLoggingIn } = useAuth();
  const onSubmit = (data: LoginSchema) => {
    login(data.email, data.password);
  };

  return (
    <div className="md:w-2/3 w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Welcome back Scholar!</h1>
      <p className="text-sm text-neutral-500 mb-4">
        Login to your account to continue
      </p>
      <form
        className="w-full max-w-md space-y-2.5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          label="Email"
          placeholder="your@email.com"
          className="py-2 "
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <TextInput
          label="Password"
          type="password"
          className="py-2 "
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button
          className="w-full"
          variant="primary"
          size="md"
          type="submit"
          loading={isLoggingIn}
          disabled={isLoggingIn || !!errors.email || !!errors.password}
        >
          Login
        </Button>
        <div className="w-full flex flex-col items-start mt-2">
          <Link
            to="/auth/forgot-password"
            className="underline text-primary-500 self-end text-sm mb-2"
          >
            Forgot Password
          </Link>
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/auth/register" className="underline text-primary-500">
              Register
            </Link>
          </p>
        </div>
      </form>
      <p className="text-sm mt-4">OR</p>
      <GoogleAuthButton />
    </div>
  );
};

export default LoginForm;
