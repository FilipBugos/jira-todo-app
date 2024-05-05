'use server';

import {db} from "../../db/db";
import {InsertProject, project, user, userProject} from "../../db/schema";
import {and, eq, SQL} from "drizzle-orm";

export const getProject = async (filters?: SQL[]) => {
	return await db.select().from(user).where(filters ? and(...filters) : undefined);
};

export const createProject = async (data: InsertProject) => {
	return await db.insert(project).values(data);
}

// Get all projects with all participants
export const getAllUserProjects = async (filters?: SQL[]) => {
	const projectsWithUsers =  await db
		.select()
		.from(userProject)
		.leftJoin(project, eq(project.ID, userProject.Project))
		.leftJoin(user, eq(user.ID, userProject.User))
		.where(filters ? and(...filters) : undefined)
		.execute();

	return projectsWithUsers.map((project) => ({
		project: {...project.Project},
		user: {...project.User},
	}));
};

export type ProjectsWithUsers = Awaited<ReturnType<typeof getAllUserProjects>>[number];