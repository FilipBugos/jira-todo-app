"use client";

import { useFormState, useFormStatus } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signup } from "@/actions/authActions";
import { checkIsUsernameUnique } from "@/actions/userActions";

import { FormInput } from "../form-fields/form-input";

import { Button } from "./button";

const formSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .email()
    .refine(
      async (username) =>
        // Assuming the function valueExistsInDatabase checks if email already exists
        await checkIsUsernameUnique(username),
      {
        message: "Username already exists in the database",
      },
    ),
  password: z.string().min(10),
});

export type SignUpUserSchema = z.infer<typeof formSchema>;
export function SignupForm() {
  const [errorMessage, dispatch] = useFormState(signup, undefined);
  const form = useForm<SignUpUserSchema>({
    resolver: zodResolver(formSchema),
  });

  return (
    <FormProvider {...form}>
      <form action={dispatch} className="space-y-3">
        <FormInput name="name" type="name" placeholder="Name" />
        <FormInput name="email" type="email" placeholder="example@google.com" />
        <FormInput name="password" type="password" placeholder="Password" />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <p className="text-sm text-red-500">
                {errorMessage.errors?.email}
              </p>
              <p className="text-sm text-red-500">
                {errorMessage.errors?.password}
              </p>
            </>
          )}
        </div>
        <SignupButton />
      </form>
    </FormProvider>
  );
}

export function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {pending ? "Submitting..." : "Sign up"}
    </Button>
  );
}
