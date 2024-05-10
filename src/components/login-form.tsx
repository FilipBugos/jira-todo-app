"use client";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/actions/authActions';
import { Button } from "./ui/button";
import { FormInput } from "./form-fields/form-input";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10),
});

export type CreateProjectSchema = z.infer<typeof formSchema>;

export default function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);
    const form = useForm<CreateProjectSchema>({
        resolver: zodResolver(formSchema),
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
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="mt-4 w-full" aria-disabled={pending}>
            Log in
        </Button>
    );
}