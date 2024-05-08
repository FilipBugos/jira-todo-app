"use server";

import { alias } from "drizzle-orm/sqlite-core";
import { db } from "../../db/db";
import { InsertIssue, issue, sprint, user } from "../../db/schema";
import { and, eq, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getIssue = async (filters?: SQL[]) => {
  return await db
    .select()
    .from(issue)
    .where(filters ? and(...filters) : undefined);
};

export const createIssue = async (data: InsertIssue) => {
  const insertedIssue =  await db.insert(issue).values(data);
  revalidatePath("/");
  return insertedIssue;
};

export const getIssuesJoined = async (filters?: SQL[]) => {
  const assigne = alias(user, "assignee");
  const creator = alias(user, "creator");
  const issues = await db
    .select()
    .from(issue)
    .leftJoin(creator, eq(creator.ID, issue.CreatedBy))
    .leftJoin(assigne, eq(assigne.ID, issue.AssignedTo))
    .leftJoin(sprint, eq(sprint.ID, issue.SprintID))
    .where(filters ? and(...filters) : undefined)
    .execute();

  return issues.map((issue) => ({
    ...issue.Issue,
    CreatedBy: issue.creator,
    AssignedTo: issue.assignee,
    Sprint: issue.Sprint,
  }));
};

export type IssueJoined = Awaited<ReturnType<typeof getIssuesJoined>>[number];
