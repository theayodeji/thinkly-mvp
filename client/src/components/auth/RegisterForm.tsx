import React from "react";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchema } from "../../shared/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuthButton";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const { register: registerUser, loading } = useAuth();
  const onSubmit = (data: RegisterSchema) => {
    registerUser(data.email, data.password, data.name);
  };

  return (
    <div className="md:w-2/3 w-full flex flex-col justify-center items-center">
      {/* <img src="/thinkly-black.png" alt="Thinkly" className="w-64" /> */}
      <h1 className="text-2xl font-bold">Hello <span className="text-primary-500">Scholar</span>!</h1>
      <p className="text-sm text-text-secondary mb-4">
        Register to create an account
      </p>
      <form
        className="w-full max-w-md space-y-2.5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          label="Name"
          placeholder="What's your name?"
          className="py-2 "
          autoComplete="name"
          {...register("name")}
          error={errors.name?.message}
        />
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
        <TextInput
          label="Confirm Password"
          type="password"
          className="py-2 "
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button
          className="w-full"
          variant="primary"
          size="md"
          type="submit"
          loading={loading}
          disabled={loading || !!errors.email || !!errors.password || !!errors.confirmPassword}
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
    </div>
  );
};

export default RegisterForm;
