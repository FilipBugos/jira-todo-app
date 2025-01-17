'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState, useFormStatus } from 'react-dom';

import { ownSignIn } from '@/actions/authActions';
import { SignInFormSchema, type SignInFormSchemaType } from '@/lib/definitions';

import { Button } from './ui/button';
import { FormInput } from './form-fields/form-input';

const LoginForm = () => {
	const [errorMessage, dispatch] = useFormState(ownSignIn, undefined);
	const form = useForm<SignInFormSchemaType>({
		resolver: zodResolver(SignInFormSchema)
	});

	return (
		<FormProvider {...form}>
			<form action={dispatch}>
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
				<LoginButton />

				{errorMessage && (
					<div
						className="mt-4 flex flex-col items-center"
						aria-live="polite"
						aria-atomic="true"
					>
						{errorMessage.errors?.email && (
							<p className="text-sm text-red-500">
								{errorMessage.errors?.email}
							</p>
						)}
						{errorMessage.errors?.password && (
							<p className="text-sm text-red-500">
								{errorMessage.errors?.password}
							</p>
						)}
					</div>
				)}
			</form>
		</FormProvider>
	);
};

const LoginButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button
			className="mt-4 w-full rounded-md bg-blue-500 p-3 text-white hover:bg-blue-600"
			aria-disabled={pending}
		>
			{pending ? 'Logging in...' : 'Log In'}
		</Button>
	);
};

export default LoginForm;
