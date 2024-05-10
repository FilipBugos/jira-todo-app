import NextAuth from 'next-auth';

import { NextRequest } from 'next/server';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
export function middleware(request: NextRequest) {
    console.log('middleware');
    // response.headers.set('Access-Control-Allow-Origin', 'https://our-versail-domain.com');
}