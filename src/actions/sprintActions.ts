'use server';

import {db} from "../../db/db";
import {InsertSprint, sprint, user} from "../../db/schema";
import {and, eq, SQL} from "drizzle-orm";

export const getSprint = async (filters?: SQL[]) => {
	return await db.select().from(user).where(filters ? and(...filters) : undefined);
};

export const createSprint = async (data: InsertSprint) => {
	return await db.insert(sprint).values(data);
}