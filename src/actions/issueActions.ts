"use server";

import { alias } from "drizzle-orm/sqlite-core";
import { and, eq, type SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../../db/db";
import { type InsertIssue, issue, project, sprint, user } from "../../db/schema";

export const getIssue = async (filters?: SQL[]) =>
  await db
    .select()
    .from(issue)
    .where(filters ? and(...filters) : undefined);

export const createIssue = async (data: InsertIssue) => {
  const insertedIssue = await db.insert(issue).values(data);
  revalidatePath("/");
  return insertedIssue;
};

export const getIssuesJoined = async (filters?: SQL[]) => {
  const assigne = alias(user, "assignee");
  const creator = alias(user, "creator");
  const issues = await db
    .select()
    .from(issue)
    .leftJoin(project, eq(project.ID, issue.ProjectID))
    .leftJoin(creator, eq(creator.id, issue.CreatedBy))
    .leftJoin(assigne, eq(assigne.id, issue.AssignedTo))
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

export const updateIssue = async (data: InsertIssue) => {
  const returned = await db
    .update(issue)
    .set(data)
    .where(eq(issue.ID, data.ID))
    .returning({ updatedId: issue.ID });
  revalidatePath("/");
};

export const assignIssueToSprint = async (issueId: number, sprintId: number) => {
  const issueEntity = await getIssue([eq(issue.ID, issueId)]);
  const returned = await db
    .update(issue)
    .set({
      ...issueEntity,
      SprintID: sprintId
    })
    .where(eq(issue.ID, issueId))
    .returning({ updatedId: issue.ID });
  revalidatePath("/");
};


export type IssueJoined = Awaited<ReturnType<typeof getIssuesJoined>>[number];
