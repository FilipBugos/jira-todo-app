import { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { getUserByEmail } from "@/actions/userActions";

import { db } from "./db/db";
import { accounts, sessions, user, verificationTokens } from "./db/schema";

const getIsProtectedPath = (path: string) => {
  const paths = ["/"];

  return paths.some((p) => path.startsWith(p));
};

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GitHub,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(10) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const foundUser = await getUserByEmail(email);
          if (foundUser.length === 0) return null;
          const user = foundUser[0];
          const bcrypt = require("bcrypt");
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user; // Return the user object
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      console.log("session", session, user);
      session.user.id = user.id;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = getIsProtectedPath(nextUrl.pathname);

      // if (!isLoggedIn && isProtected) {
      //   const redirectUrl = new URL("/login", nextUrl.origin);
      //   console.log("searchParams", redirectUrl.searchParams);
      //   redirectUrl.searchParams.append("callbackUrl", nextUrl.href);

      //   return Response.redirect(redirectUrl);
      // }

      return true;
    },
  },
} satisfies NextAuthConfig;
