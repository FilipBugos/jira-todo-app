import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db/db';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getUser } from "@/actions/userActions";
import { Provider } from 'next-auth/providers';

const getIsProtectedPath = (path: string) => {
    const paths = ['/protected'];

    return paths.some(p => path.startsWith(p));
};

const providers: Provider[] = [
    GitHub,
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const result = await getUser([eq(user.email, email)]);
                if (result.length === 0) return null;
                const user = result[0];
                const bcrypt = require("bcrypt");
                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) {
                    return user; // Return the user object
                }
            }
            return null;
        },
    }),
]

export const authConfig = {
    providers,
    adapter: DrizzleAdapter(db),
    pages: {
        signIn: '/login',
    },
    session: { strategy: "database" },
    callbacks: {
        async session({ session: { user }, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.sessionToken = token.accessToken
            session.userId = token.id

            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            console.log('authorized', auth, nextUrl);
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