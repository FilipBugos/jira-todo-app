import { eq } from 'drizzle-orm';

import { db } from '../../db/db';
import { sessions } from '../../db/schema';

export const getSessionByToken = async (token: string) => {
	const result = await db
		.select()
		.from(sessions)
		.where(eq(sessions.sessionToken, token))
		.execute();
	return result[0];
};
