'use server';

import {db} from "../../db/db";
import {InsertUser, user} from "../../db/schema";
import {and, eq, SQL} from "drizzle-orm";


export const getUser = async (filters?: SQL[]) => {
	return await db.select().from(user).where(filters ? and(...filters) : undefined);
};

export const createUser = async (data: InsertUser) => {
	return await db.insert(user).values(data);
};