'use server';

import { alias } from 'drizzle-orm/sqlite-core';
import { and, eq, or, type SQL } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '../../db/db';
import { type InsertIssue, issue } from '../../db/schema';

export const getIssue = async (filters?: SQL[]) =>
	await db
		.select()
		.from(issue)
		.where(filters ? and(...filters) : undefined);

export const createIssue = async (data: InsertIssue) => {
	if (data.SprintID === 0) {
		data.SprintID = null;
	}
	const insertedIssue = await db.insert(issue).values(data);
	revalidatePath('/');
	return insertedIssue;
};

export const getIssuesJoined = async (filters?: SQL[]) => {
	const issues = await db.query.issue.findMany({
		with: {
			Sprint: true,
			Project: true,
			CreatedBy: true,
			AssignedTo: true
		},
		where: filters ? and(...filters) : undefined
	});

	return issues.map(issue => ({
		...issue,
		CreatedBy: issue.CreatedBy,
		AssignedTo: issue.AssignedTo,
		Sprint: issue.Sprint,
		Project: issue.Project
	}));
};

export const updateIssue = async (data: InsertIssue) => {
	const returned = await db
		.update(issue)
		.set(data)
		.where(eq(issue.ID, data.ID))
		.returning({ updatedId: issue.ID });
	revalidatePath('/');
};

export const assignIssueToSprint = async (
	issueId: number,
	sprintId: number
) => {
	const issueEntity = await getIssue([eq(issue.ID, issueId)]);
	const returned = await db
		.update(issue)
		.set({
			...issueEntity,
			SprintID: sprintId
		})
		.where(eq(issue.ID, issueId))
		.returning({ updatedId: issue.ID });
	revalidatePath('/');
};

export const getProjectsIssues = async (projectsIds: number[]) => {
	const issues = await db.query.issue.findMany({
		with: {
			Sprint: true,
			Project: true,
			CreatedBy: true,
			AssignedTo: true
		},
		where: or(...projectsIds.map(projectId => eq(issue.ProjectID, projectId)))
	});

	return issues.map(issue => ({
		...issue,
		CreatedBy: issue.CreatedBy,
		AssignedTo: issue.AssignedTo,
		Sprint: issue.Sprint,
		Project: issue.Project
	}));
};

export type IssueJoined = Awaited<ReturnType<typeof getIssuesJoined>>[number];
