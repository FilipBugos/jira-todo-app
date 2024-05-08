import NextAuth from 'next-auth';
import { authOptions } from './auth';
import { NextRequest } from 'next/server';

export default NextAuth(authOptions).auth;

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
export function middleware(request: NextRequest) {

    // response.headers.set('Access-Control-Allow-Origin', 'https://our-versail-domain.com');
}