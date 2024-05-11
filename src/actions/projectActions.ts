'use server';

import { alias } from "drizzle-orm/sqlite-core";
import {db} from "../../db/db";
import {InsertProject, InsertUserProject, project, sprint, user, userProject} from "../../db/schema";
import {and, eq, or, SQL} from "drizzle-orm";
import { createSprint } from "./sprintActions";

export type ProjectWithUserProjecs = {
	Project: InsertProject,
	UserProjectEntities: {
		User: number;
		Role: string;
	}[];
};

export const getProject = async (filters?: SQL[]) => {
	return await db.select().from(user).where(filters ? and(...filters) : undefined);
};

export const createProject = async (data: InsertProject) => {
	return await db.insert(project).values(data);
}

export const createProjectFromDialog = async (data: ProjectWithUserProjecs) => {
	// TODO: all of these should be transactional
	
	// insert project
	const projectEntity = await db.insert(project).values(data.Project);
	
	// create backlog for the project
	await createSprint({Project: Number(projectEntity.lastInsertRowid), Name: "Backlog", StartDate: data.Project.CreatedTime });

	// insert roles
	data.UserProjectEntities.length > 0 ? await db
									.insert(userProject)
									.values(data.UserProjectEntities.map(up => { 
										return {...up, Project: Number(projectEntity.lastInsertRowid)}
									}))
		 : undefined;

	return projectEntity;
}

// Get all projects with all participants
export const getAllUserProjects = async (filters?: SQL[]) => {
	const userProject2 = alias(userProject, "userProject2");
	const projectsWithUsers =  await db
		.select()
		.from(userProject)
		// TODO: next line is a mistake
		.leftJoin(userProject2, eq(userProject.ID, userProject2.ID))
		.leftJoin(project, eq(project.ID, userProject.Project))
		.leftJoin(user, or(eq(user.ID, userProject2.User), eq(user.ID, project.CreatedBy)))
		.where(filters ? and(...filters) : undefined)
		.execute();

	return projectsWithUsers.map((project) => ({
		project: project.Project,
		userProject: project.UserProject,
		user: project.User,
	}));
};

export type ProjectsWithUsers = Awaited<ReturnType<typeof getAllUserProjects>>[number];