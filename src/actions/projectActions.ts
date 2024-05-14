'use server';

import { and, count, eq, type SQL } from 'drizzle-orm';

import { createSprint } from '@/actions/sprintActions';

import { db } from '../../db/db';
import {
	type InsertProject,
	project,
	sprint,
	user,
	userProject
} from '../../db/schema';

export type ProjectWithUserProjecs = {
	Project: InsertProject;
	UserProjectEntities: {
		User: string;
		Role: string;
	}[];
};

export const getProject = async (filters?: SQL[]) =>
	await db
		.select()
		.from(project)
		.where(filters ? and(...filters) : undefined);

export const createProject = async (data: InsertProject) =>
	await db.insert(project).values(data);

export const createProjectFromDialog = async (data: ProjectWithUserProjecs) => {
	// TODO: all of these should be transactional

	// insert project
	const projectEntity = await db.insert(project).values(data.Project);

	// create backlog for the project
	await createSprint({
		Project: Number(projectEntity.lastInsertRowid),
		Name: 'Backlog',
		StartDate: data.Project.CreatedTime
	});

	// insert roles
	data.UserProjectEntities.length > 0
		? await db.insert(userProject).values(
				data.UserProjectEntities.map(up => ({
					...up,
					Project: Number(projectEntity.lastInsertRowid)
				}))
			)
		: undefined;

	return projectEntity;
};

// Get all projects with all participants
export const getAllUserProjects = async (userID: string) => {
	// const userProject2 = alias(userProject, "userProject2");
	const projectsWithUsers = await db.query.project.findMany({
		with: {
			Members: {
				with: {
					User: true
				}
			},
			Sprints: true
		}
	});
	return projectsWithUsers
		.filter(p => p.Members.some(m => m.User.id === userID))
		.map(project => ({
			project
		}));
};

export const assignCurrentSprint = async (projectId: number, sprintId: number) => {
	const projectEntity = await getProject([eq(project.ID, projectId)]);
	return await db
    .update(project)
    .set({
      ...projectEntity,
      CurrentSprint: sprintId
    })
    .where(eq(project.ID, projectId));
};

export const getAllProjectSprints = async (projectId: number) => {
	return await db
	.select({ count: count() })
	.from(sprint)
	.where(eq(sprint.Project, projectId))
};

export type ProjectsWithUsers = Awaited<
	ReturnType<typeof getAllUserProjects>
>[number];
