"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState, useFormStatus } from "react-dom";

import { ownSignIn } from "@/actions/authActions";
import { SignInFormSchema, type SignInFormSchemaType } from "@/lib/definitions";

import { Button } from "./ui/button";
import { FormInput } from "./form-fields/form-input";

const LoginForm = () => {
  const [errorMessage, dispatch] = useFormState(ownSignIn, undefined);
  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(SignInFormSchema),
  });

  return (
    <FormProvider {...form}>
      <form action={dispatch} className="space-y-3">
        <FormInput name="email" type="email" placeholder="example@google.com" />
        <FormInput name="password" type="password" placeholder="Password" />
        <LoginButton />
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
      </form>
    </FormProvider>
  );
};

const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {pending ? "Logging in..." : "Log In"}
    </Button>
  );
};

export default LoginForm;
