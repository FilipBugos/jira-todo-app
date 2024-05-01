'use server';

import {db} from "../../db/db";
import {InsertIssue, issue, user} from "../../db/schema";
import {and, eq, SQL} from "drizzle-orm";

export const getIssue = async (filters?: SQL[]) => {
	return await db.select().from(user).where(filters ? and(...filters) : undefined);
};

export const createIssue = async (data: InsertIssue) => {
	return await db.insert(issue).values(data);
}