"use server";

import { and, type SQL } from "drizzle-orm";

import { db } from "../../db/db";
import { type InsertSprint, sprint } from "../../db/schema";

export const getSprint = async (filters?: SQL[]) =>
  await db
    .select()
    .from(sprint)
    .where(filters ? and(...filters) : undefined);

export const createSprint = async (data: InsertSprint) =>
  await db.insert(sprint).values(data);

// get all sprint a user may be included in
export const getSprintsOfUser = async (filters?: SQL[]) =>
  await db.query.sprint.findMany({
    with: {
      Project: {
        with: {
          Members: true
        },
      }
    },
    where: filters ? and(...filters) : undefined
  });

/*    .select({ sprint })
    .from(sprint)
    .leftJoin(userProject, eq(userProject.Project, sprint.Project))
    .leftJoin(user, eq(userProject.User, user.ID))
    .where(filters ? and(...filters) : undefined);
*/
export type SprintsWithUsers = Awaited<
  ReturnType<typeof getSprintsOfUser>
>[number];
