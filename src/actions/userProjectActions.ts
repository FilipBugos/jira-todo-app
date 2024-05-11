"use server";

import { and, type SQL } from "drizzle-orm";

import { db } from "../../db/db";
import { type InsertUserProject, user, userProject } from "../../db/schema";

export const getUserProject = async (filters?: SQL[]) =>
  await db
    .select()
    .from(user)
    .where(filters ? and(...filters) : undefined);

export const createUserProject = async (data: InsertUserProject) =>
  await db.insert(userProject).values(data);
