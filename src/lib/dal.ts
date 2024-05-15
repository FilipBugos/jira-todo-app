import 'server-only';

import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

import { decrypt } from '@/lib/session';

import { sessions, user } from '../../db/schema';
import { db } from '../../db/db';

export const verifySession = async () => {
	const cookie = cookies().get('session')?.value;
	const session = await decrypt(cookie);

	const authSessionCookie = cookies().get('authjs.session-token')?.value;
	if (!session) {
		if (!authSessionCookie) return { isAuth: false, userId: null };
		const data = await db
			.select()
			.from(sessions)
			.where(eq(sessions.sessionToken, authSessionCookie));
		const authenticatedUser = data[0];
		return { isAuth: !!authenticatedUser, userId: authenticatedUser?.userId };
	}
	return { isAuth: !!session, userId: session?.userId };
};

export const getUser = async () => {
	const session = await verifySession();
	if (!session) return null;

	try {
		const data = await db.query.user.findMany({
			where: eq(user.id, session.userId),
			// Explicitly return the columns you need rather than the whole user object
			columns: {
				id: true,
				name: true,
				email: true
			}
		});

		const returnedUser = data[0];

		return returnedUser;
	} catch (error) {
		console.log('Failed to fetch user');
		return null;
	}
};
