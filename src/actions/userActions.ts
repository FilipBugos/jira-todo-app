'use server';

import { and, eq, type SQL } from 'drizzle-orm';

import { db } from '../../db/db';
import { type InsertUser, user } from '../../db/schema';

export const getUser = async (filters?: SQL[]) =>
	await db
		.select()
		.from(user)
		.where(filters ? and(...filters) : undefined);

export const createUser = async (data: InsertUser) =>
	await db.insert(user).values(data);

export const getUserByEmail = async (email: string) => {
	const result = await db.select().from(user).where(eq(user.email, email));
	return result;
};

export const getUserById = async (id: string) => {
	const result = await db.select().from(user).where(eq(user.id, id));
	return result;
};

export const getUserByUsername = async (username: string) => {
	console.log('username', username);
	const result = await db
		.select()
		.from(user)
		.where(eq(user.username, username))
		.execute();
	return result;
};

export async function checkIsUsernameUnique(
	username: string
): Promise<boolean> {
	const result = await db
		.select()
		.from(user)
		.where(eq(user.username, username))
		.execute();
	return result.length === 0;
}
