'use server';

import {db} from "../../db/db";
import {InsertProject, project, user} from "../../db/schema";
import {and, eq, SQL} from "drizzle-orm";

export const getProject = async (filters?: SQL[]) => {
	return await db.select().from(user).where(filters ? and(...filters) : undefined);
};

export const createProject = async (data: InsertProject) => {
	return await db.insert(project).values(data);
}