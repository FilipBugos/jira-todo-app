import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: DefaultSession['user'] & {
            ID: string;
            email: string;
            emailVerified: number;
            name: string;
            image: string;
        };
    }
}