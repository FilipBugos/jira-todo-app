'use client';

import { useActionState } from 'react';
import { authenticate, signup } from '@/actions/authActions';
import { useFormState, useFormStatus } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { FormState, SignupFormSchemaType } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { checkIsUsernameUnique } from '@/actions/userActions';

const formSchema = z.object({
	email: z.string().email(),
	username: z
		.string()
		.email()
		.refine(
			async username =>
				// Assuming the function valueExistsInDatabase checks if email already exists
				await checkIsUsernameUnique(username),
			{
				message: 'Username already exists in the database'
			}
		),
	password: z.string().min(10)
});

export type SignUpUserSchema = z.infer<typeof formSchema>;
export function SignupForm() {
	const [errorMessage, dispatch] = useFormState(signup, undefined);
	const form = useForm<SignUpUserSchema>({
		resolver: zodResolver(formSchema)
	});

	return (
		<FormProvider {...form}>
			<form action={dispatch}>
				<div>
					<label htmlFor="name">Name</label>
					<input id="name" name="name" placeholder="Name" />
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<input id="email" name="email" placeholder="Email" />
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input id="password" name="password" type="password" />
				</div>
				{errorMessage && (
					<>
						<p>{errorMessage.errors?.email}</p>
						<p>{errorMessage.errors?.password}</p>
					</>
				)}
				<SignupButton />
			</form>
		</FormProvider>
	);
}

export function SignupButton() {
	const { pending } = useFormStatus();

	return (
		<button aria-disabled={pending} type="submit">
			{pending ? 'Submitting...' : 'Sign up'}
		</button>
	);
}
