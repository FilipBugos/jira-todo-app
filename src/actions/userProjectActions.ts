'use server';

import {db} from "../../db/db";
import {InsertUserProject, user, userProject} from "../../db/schema";
import {and, eq, SQL} from "drizzle-orm";
import {createSprint} from "@/actions/sprintActions";

export const getUserProject = async (filters?: SQL[]) => {
	return await db.select().from(user).where(filters ? and(...filters) : undefined);
};

export const createUserProject = async (data: InsertUserProject) => {
	return await db.insert(userProject).values(data);
}