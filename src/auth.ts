import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';

export const providerMap = authConfig.providers.map((provider) => {
    if (typeof provider === "function") {
        const providerData = provider()
        return { id: providerData.id, name: providerData.name }
    } else {
        return { id: provider.id, name: provider.name }
    }
}).filter((provider) => provider.id !== "credentials");

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);