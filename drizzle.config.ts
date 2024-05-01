import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './db/schema.ts',
    out: './migrations',
    driver: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        authToken: process.env.AUTH_TOKEN!
    }
} satisfies Config;