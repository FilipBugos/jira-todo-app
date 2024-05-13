import 'server-only';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { Session } from '@auth/core/types';
import { cookies } from 'next/headers';
import { db } from '../../db/db';
import { sessions } from '../../db/schema';
import { getSessionByToken } from '@/actions/sessionActions';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
	return getSessionByToken(session);
}

export async function createSession(userId: string) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	const session = await encrypt({ userId, expiresAt });

	// 1. Create a session in the database
	const data = await db
		.insert(sessions)
		.values({
			sessionToken: session,
			userId: userId,
			expires: expiresAt
		})
		// Return the session ID
		.returning({ id: sessions.userId });

	const sessionId = data[0].id;

	cookies().set('session', session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: 'lax',
		path: '/'
	});
}

export async function updateSession() {
	const session = cookies().get('session')?.value;
	const payload = await decrypt(session);

	if (!session || !payload) {
		return null;
	}

	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	cookies().set('session', session, {
		httpOnly: true,
		secure: true,
		expires: expires,
		sameSite: 'lax',
		path: '/'
	});
}
export function deleteSession() {
	cookies().delete('session');
}
