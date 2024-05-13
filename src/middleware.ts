import NextAuth from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';

import { authConfig } from '../auth.config';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/profile'];
const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	// 3. Decrypt the session from the cookie
	const cookie = cookies().get('session')?.value;
	const session = await decrypt(cookie);
	console.log('MD: session', session);
	console.log('MD: cookie', cookie);

	// 5. Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !session?.userId) {
		return NextResponse.redirect(new URL('/login', req.nextUrl));
	}

	// 6. Redirect to /dashboard if the user is authenticated
	if (
		isPublicRoute &&
		session?.userId &&
		!req.nextUrl.pathname.startsWith('/overview')
	) {
		return NextResponse.redirect(new URL('/overview', req.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
};
