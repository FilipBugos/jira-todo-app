'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState, useFormStatus } from 'react-dom';

import { authenticate, ownSignIn } from '@/actions/authActions';
import { checkIsUsernameUnique } from '@/actions/userActions';

import { Button } from './ui/button';
import { FormInput } from './form-fields/form-input';
import { SignInFormSchema, SignInFormSchemaType } from '@/lib/definitions';

const LoginForm = () => {
	const [errorMessage, dispatch] = useFormState(ownSignIn, undefined);
	const form = useForm<SignInFormSchemaType>({
		resolver: zodResolver(SignInFormSchema)
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
								Email: {errorMessage.errors?.email}
							</p>
							<p className="text-sm text-red-500">
								Password: {errorMessage.errors?.password}
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
			Log in
		</Button>
	);
};

export default LoginForm;
