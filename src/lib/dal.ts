import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '../../db/db';
import { eq } from 'drizzle-orm';

export const verifySession = async () => {
	const cookie = cookies().get('session')?.value;
	const session = await decrypt(cookie);

	if (!session?.userId) {
		redirect('/login');
	}

	return { isAuth: true, userId: session.userId };
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
