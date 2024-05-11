"use server";

import { and, type SQL } from "drizzle-orm";

import { createSprint } from "@/actions/sprintActions";

import { db } from "../../db/db";
import {
  type InsertProject,
  project,
  user,
  userProject
} from "../../db/schema";

export type ProjectWithUserProjecs = {
  Project: InsertProject;
  UserProjectEntities: {
    User: number;
    Role: string;
  }[];
};

export const getProject = async (filters?: SQL[]) =>
  await db
    .select()
    .from(user)
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
    Name: "Backlog",
    StartDate: data.Project.CreatedTime
  });

  // insert roles
  data.UserProjectEntities.length > 0
    ? await db.insert(userProject).values(
        data.UserProjectEntities.map((up) => ({
          ...up,
          Project: Number(projectEntity.lastInsertRowid)
        }))
      )
    : undefined;

  return projectEntity;
};

// Get all projects with all participants
export const getAllUserProjects = async (userID: number) => {
  // const userProject2 = alias(userProject, "userProject2");
  const projectsWithUsers = await db.query.project.findMany({
    with: {
      Members: {
        with: {
          User: true
        },
      },
      Sprints: true
    },
  });
  return projectsWithUsers
    .filter((p) => p.Members.some((m) => m.User.ID === userID))
    .map((project) => ({
      project
    }));
};

export type ProjectsWithUsers = Awaited<
  ReturnType<typeof getAllUserProjects>
>[number];
