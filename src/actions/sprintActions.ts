'use server';

import {db} from "../../db/db";
import {InsertSprint, project, sprint, user, userProject} from "../../db/schema";
import {and, eq, SQL} from "drizzle-orm";

export const getSprint = async (filters?: SQL[]) => {
	return await db.select().from(sprint).where(filters ? and(...filters) : undefined);
};

export const createSprint = async (data: InsertSprint) => {
	return await db.insert(sprint).values(data);
}

// get all sprint a user may be included in
export const getSprintsOfUser = async (filters?: SQL[]) => {
	return await db
			.select({sprint: sprint})
			.from(sprint)
			.leftJoin(userProject, eq(userProject.Project, sprint.Project))
			.leftJoin(user, eq(userProject.User, user.ID))
			.where(filters ? and(...filters) : undefined);
};

export type ProjectsWithUsers = Awaited<ReturnType<typeof getSprintsOfUser>>[number];