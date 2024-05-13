'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import {
	FormState,
	SignInFormSchema,
	SignupFormSchema,
	SignupFormSchemaType
} from '@/lib/definitions';
import {
	createUser,
	getUserById,
	getUserByUsername
} from '@/actions/userActions';
import { db } from '../../db/db';
import { user } from '../../db/schema';
import { redirect } from 'next/navigation';
import { createSession, decrypt, deleteSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/dal';

export async function authenticate(
	prevState: string | undefined,
	formData: FormData
) {
	try {
		await signIn('credentials', formData);
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.';
				default:
					return 'Something went wrong.';
			}
		}
		throw error;
	}
}
export async function ownSignIn(
	prevState: string | undefined,
	formData: FormData
) {
	console.log('LOGGING IN');
	console.log(formData);
	const validatedFields = SignInFormSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password')
	});

	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors
		};
	}

	// 2. Prepare data for insertion into database
	const { email, password } = validatedFields.data;

	console.log('Checkpoint 1 ${email} ${password}');
	console.log(email);
	const data = await getUserByUsername(email);
	console.log('Checkpoint 2');
	console.log(data);
	const returnedUser = data[0];

	if (!returnedUser) {
		return {
			errors: {
				email: 'User not found.'
			}
		};
	}

	console.log('Checkpoint 3');
	const bcrypt = require('bcrypt');
	const isValidPassword = await bcrypt.compare(password, returnedUser.password);

	if (!isValidPassword) {
		return {
			errors: {
				password: 'Invalid password.'
			}
		};
	}

	console.log('Checkpoint 4');
	await createSession(returnedUser.id);
	redirect('/profile');
}
export async function signup(
	prevState: string | undefined,
	formData: FormData
) {
	// Validate form fields
	const validatedFields = SignupFormSchema.safeParse({
		name: formData.get('name'),
		username: formData.get('email'),
		email: formData.get('email'),
		password: formData.get('password')
	});

	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors
		};
	}

	// 2. Prepare data for insertion into database
	const { name, email, password } = validatedFields.data;
	// e.g. Hash the user's password before storing it
	const bcrypt = require('bcrypt');
	const hashedPassword = await bcrypt.hash(password, 10);

	// 3. Insert the user into the database or call an Auth Library's API
	const data = await db
		.insert(user)
		.values({
			name: name,
			username: email,
			email: email,
			password: hashedPassword
		})
		.returning({ id: user.id });

	const createdUser = data[0];

	if (!createdUser) {
		return {
			message: 'An error occurred while creating your account.'
		};
	}

	await createSession(createdUser.id);
	// 5. Redirect user
	redirect('/profile');
}

export async function logout() {
	deleteSession();
	redirect('/login');
}

export const getLoggedInUser = async () => {
	const { isAuth, userId } = await verifySession();
	console.log('getLoggedInUserFunc');
	if (!isAuth || !userId) {
		return;
	}

	const loggedInUser = await getUserById(userId);
	return loggedInUser[0];
};
