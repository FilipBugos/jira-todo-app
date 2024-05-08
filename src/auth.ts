import NextAuth, { type NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '../db/db';

const getIsProtectedPath = (path: string) => {
    const paths = ['/protected'];

    return paths.some(p => path.startsWith(p));
};

export const authOptions = {
    providers: [GitHub],
    adapter: DrizzleAdapter(db),

    callbacks: {
        session({ session, user }) {
            // Assign user.id to session.user.id
            session.user.id = user.id;

            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            const isProtected = getIsProtectedPath(nextUrl.pathname);

            if (!isLoggedIn && isProtected) {
                const redirectUrl = new URL('/api/auth/signin', nextUrl.origin);
                redirectUrl.searchParams.append('callbackUrl', nextUrl.href);

                return Response.redirect(redirectUrl);
            }

            return true;
        }
    }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);