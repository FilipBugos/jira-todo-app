'use server';

import { and, eq, type SQL } from 'drizzle-orm';

import { db } from '../../db/db';
import { type InsertSprint, issue, sprint } from '../../db/schema';
import { revalidateProjectLayout } from '@/common/revalidate';

export const getSprint = async (filters?: SQL[]) =>
	await db
		.select()
		.from(sprint)
		.where(filters ? and(...filters) : undefined);

export const createSprint = async (data: InsertSprint) =>
	await db.insert(sprint).values(data).returning({ id: sprint.ID });

// get all sprint a user may be included in
export const getSprintsOfUser = async (filters?: SQL[]) =>
	await db.query.sprint.findMany({
		with: {
			Project: {
				with: {
					Members: true
				}
			}
		},
		where: filters ? and(...filters) : undefined
	});

export const getActiveUserSprint = async (filters?: SQL[]) => {
	const sprints = await getSprintsOfUser(filters);
	return sprints.find(
		sprint => sprint.StartDate < new Date() && sprint.EndDate > new Date()
	);
};
/*    .select({ sprint })
    .from(sprint)
    .leftJoin(userProject, eq(userProject.Project, sprint.Project))
    .leftJoin(user, eq(userProject.User, user.id))
    .where(filters ? and(...filters) : undefined);
*/

export const endSprint = async (sprintId: number) => {
	const sprintToUpdate = await db.query.sprint.findFirst(sprintId);
	await db
		.update(sprint)
		.set({ EndDate: new Date() })
		.where(eq(sprint.ID, sprintId));
	revalidateProjectLayout();
};
export type SprintsWithUsers = Awaited<
	ReturnType<typeof getSprintsOfUser>
>[number];
