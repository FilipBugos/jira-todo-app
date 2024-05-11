"use server";

import { and, type SQL } from "drizzle-orm";

import { db } from "../../db/db";
import { type InsertUser, user } from "../../db/schema";

export const getUser = async (filters?: SQL[]) =>
  await db
    .select()
    .from(user)
    .where(filters ? and(...filters) : undefined);

export const createUser = async (data: InsertUser) =>
  await db.insert(user).values(data);
