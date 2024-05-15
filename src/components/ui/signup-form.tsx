"use client";

import { useFormState, useFormStatus } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signup } from "@/actions/authActions";

import { FormInput } from "../form-fields/form-input";

import { Button } from "./button";
import { SignupFormSchema, type SignupFormSchemaType } from "@/lib/definitions";

export function SignupForm() {
  const [errorMessage, dispatch] = useFormState(signup, undefined);
  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(SignupFormSchema),
  });

  return (
    <FormProvider {...form}>
      <form action={dispatch} className="space-y-3">
        <FormInput
          name="name"
          type="name"
          placeholder="Name"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <FormInput
          name="email"
          type="email"
          placeholder="example@google.com"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <SignupButton />
        {errorMessage && (
          <div
            className="flex flex-col items-center mt-4"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage.errors?.name && (
              <p className="text-sm text-red-500">
                {errorMessage.errors?.name + "\n"}
              </p>
            )}
            {errorMessage.errors?.email && (
              <p className="text-sm text-red-500">
                {errorMessage.errors?.email + "\n"}
              </p>
            )}
            {errorMessage.errors?.password && (
              <p className="text-sm text-red-500">
                {errorMessage.errors?.password + "\n"}
              </p>
            )}
            {errorMessage.errors?.message && (
              <p className="text-sm text-red-500">
                {errorMessage.errors?.message + "\n"}
              </p>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full p-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      aria-disabled={pending}>
      {pending ? "Submitting..." : "Sign up"}
    </Button>
  );
}
