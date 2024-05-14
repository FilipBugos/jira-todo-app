'use server';

import { and, eq, type SQL } from 'drizzle-orm';

import { createSprint } from '@/actions/sprintActions';
import { revalidateProjectLayout } from '@/common/revalidate';

import { db } from '../../db/db';
import {
	type InsertProject,
	project,
	type SelectUser,
	user,
	userProject
} from '../../db/schema';

export type ProjectWithUserProjecs = {
	Project: InsertProject;
	UserProjectEntities: {
		User: string;
	}[];
};

export const getProject = async (filters?: SQL[]) =>
	await db
		.select()
		.from(user)
		.where(filters ? and(...filters) : undefined);

export const getProjectByID = async (id: number) => {
	if (id === null || id === undefined) {
		throw new Error('Invalid id: id cannot be null or undefined');
	}
	console.log(`Fetching project with ID: ${id}`);
	const response = await db.query.project.findFirst({
		with: {
			Members: {
				with: {
					User: true
				}
			},
			Sprints: true
		},
		where: eq(project.ID, id)
	});
	return response;
};

export type getProjectByIDType = Awaited<ReturnType<typeof getProjectByID>>;

export const createProject = async (data: InsertProject) =>
	await db.insert(project).values(data);

export const createProjectFromDialog = async (data: ProjectWithUserProjecs) => {
	// TODO: all of these should be transactional
	// insert project
	const projectEntity = await db.insert(project).values(data.Project);

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

export const updateProjectFromDialog = async (
	inputProject: InsertProject,
	oldUsers: SelectUser[],
	newUsers: SelectUser[]
) => {
	const removedUsers = oldUsers.filter(
		ou => !newUsers.some(oou => ou.id === oou.id)
	);
	const addedUsers = newUsers.filter(
		nu => !oldUsers.some(onu => nu.id === onu.id)
	);

	console.log('removedUsers', removedUsers);
	console.log('addedUsers', addedUsers);
	// remove roles

	for (const ru of removedUsers) {
		await db.delete(userProject).where(eq(userProject.User, ru.id));
	}

	for (const au of addedUsers) {
		await db.insert(userProject).values({
			User: au.id,
			Project: inputProject.ID
		});
	}

	// update project
	const projectEntity = await db
		.update(project)
		.set(inputProject)
		.where(eq(project.ID, inputProject.ID));
	await revalidateProjectLayout();
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

export type ProjectsWithUsers = Awaited<
	ReturnType<typeof getAllUserProjects>
>[number];
