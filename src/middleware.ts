import { type NextRequest, NextResponse } from 'next/server';

import { protectedRoutes } from '../auth.config';

import { verifySession } from './lib/dal';

const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	console.log('path', path);
	const isProtectedRoute = protectedRoutes.some(route =>
		typeof route === 'function'
			? route(path)
			: path.startsWith(route) || path === route
	);
	const isPublicRoute = publicRoutes.includes(path);

	const { isAuth, userId } = await verifySession();
	if (!isAuth || !userId) {
		return;
	}

	console.log('isAuth', isAuth);
	if (isProtectedRoute && !isAuth) {
		return NextResponse.redirect(new URL('/login', req.nextUrl));
	}
	console.log('req.nextUrl.pathname = ', req.nextUrl.pathname);

	if (isPublicRoute && isAuth && !req.nextUrl.pathname.startsWith('/')) {
		return NextResponse.redirect(new URL('/', req.nextUrl));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
};
