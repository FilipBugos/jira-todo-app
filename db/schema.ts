import { sql } from "drizzle-orm";
import {
  foreignKey,
  primaryKey,
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("User", {
  ID: integer("id").primaryKey(),
  Name: text("name").notNull(),
  Password: text("password").notNull(),
});

export const project = sqliteTable("Project", {
  ID: integer("id").primaryKey(),
  Name: text("name").notNull().default(""),
  Description: text("description"),
  CreatedTime: integer("start-date", { mode: "timestamp" }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  CreatedBy: integer("created-by")
    .references(() => user.ID)
    .notNull(),
});

export const sprint = sqliteTable("Sprint", {
  ID: integer("id").primaryKey(),
  Name: text("name").notNull(),
  StartDate: integer("start-date", { mode: "timestamp" }),
  EndDate: integer("start-date", { mode: "timestamp" }),
  Project: integer("project-id")
    .references(() => project.ID)
    .notNull(),
});

export const userProject = sqliteTable("UserProject", {
  ID: integer("id").primaryKey(),
  User: integer("user-id")
    .references(() => user.ID)
    .notNull(),
  Project: integer("project-id")
    .references(() => project.ID)
    .notNull(),
  Role: text("role").notNull(),
});

export const issue = sqliteTable("Issue", {
  ID: integer("id").primaryKey(),
  Summary: text("summary").notNull(),
  Description: text("description"),
  Status: text("status"),
  CreatedTime: integer("start-date", { mode: "timestamp" }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  CreatedBy: integer("created-by")
    .references(() => user.ID)
    .notNull(),
  AssignedTo: integer("assigne-to").references(() => user.ID),
  Estimation: integer("estimation"),
  Label: integer("label"),
  SprintID: integer("sprint-id").references(() => sprint.ID),
});

export type InsertUser = typeof user.$inferInsert;
export type SelectUser = typeof user.$inferSelect;

export type InsertProject = typeof project.$inferInsert;
export type SelectProject = typeof project.$inferSelect;

export type InsertSprint = typeof sprint.$inferInsert;
export type SelectSprint = typeof sprint.$inferSelect;

export type InsertUserProject = typeof userProject.$inferInsert;
export type SelectUserProject = typeof userProject.$inferSelect;

export type InsertIssue = typeof issue.$inferInsert;
export type SelectIssue = typeof issue.$inferSelect;
