import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
  userName: string;
  userEmail: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ userName, userEmail }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userName,
      email: userEmail,
    },
  });

  const onSubmit = async (_data: ProfileSchema) => {
    toast.success("Profile updated successfully");
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-2">
        Profile Settings
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Name"
          placeholder="Your Full Name"
          autoComplete="name"
          {...register("name")}
          error={errors.name?.message}
        />
        <TextInput
          label="Email"
          disabled
          value={userEmail}
          className="opacity-75 cursor-not-allowed"
          {...register("email")}
        />
        <Button type="submit" variant="primary" loading={isSubmitting} className="mt-2">
          Save Profile
        </Button>
      </form>
    </section>
  );
};
