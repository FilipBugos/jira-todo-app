'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signup } from '@/actions/authActions';
import { SignupFormSchema, type SignupFormSchemaType } from '@/lib/definitions';

import { FormInput } from '../form-fields/form-input';

import { Button } from './button';

export const SignupForm = () => {
	const [errorMessage, dispatch] = useFormState(signup, undefined);
	const form = useForm<SignupFormSchemaType>({
		resolver: zodResolver(SignupFormSchema)
	});

	return (
		<FormProvider {...form}>
			<form action={dispatch} className="space-y-3">
				<FormInput
					name="name"
					type="name"
					placeholder="Name"
					className="w-full rounded-md border border-gray-300 p-3"
				/>
				<FormInput
					name="email"
					type="email"
					placeholder="example@google.com"
					className="w-full rounded-md border border-gray-300 p-3"
				/>
				<FormInput
					name="password"
					type="password"
					placeholder="Password"
					className="mb-4 w-full rounded-md border border-gray-300 p-3"
				/>
				<SignupButton />
				{errorMessage && (
					<div
						className="mt-4 flex flex-col items-center"
						aria-live="polite"
						aria-atomic="true"
					>
						{errorMessage.errors?.name && (
							<p className="text-sm text-red-500">
								{`${errorMessage.errors?.name}\n`}
							</p>
						)}
						{errorMessage.errors?.email && (
							<p className="text-sm text-red-500">
								{`${errorMessage.errors?.email}\n`}
							</p>
						)}
						{errorMessage.errors?.password && (
							<p className="text-sm text-red-500">
								{`${errorMessage.errors?.password}\n`}
							</p>
						)}
						{errorMessage.errors?.message && (
							<p className="text-sm text-red-500">
								{`${errorMessage.errors?.message}\n`}
							</p>
						)}
					</div>
				)}
			</form>
		</FormProvider>
	);
};

export const SignupButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button
			className="mt-4 w-full rounded-md bg-blue-500 p-3 text-white hover:bg-blue-600"
			aria-disabled={pending}
		>
			{pending ? 'Submitting...' : 'Sign up'}
		</Button>
	);
};
