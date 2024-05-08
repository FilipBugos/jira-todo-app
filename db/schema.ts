import { sql } from "drizzle-orm";
import {
	primaryKey,
	sqliteTable,
	text,
	integer,
} from "drizzle-orm/sqlite-core";

import type { AdapterAccount } from "next-auth/adapters"

export const user = sqliteTable("user", {
	ID: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	email: text("email").notNull(),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text("image"),
})

export const accounts = sqliteTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => user.ID, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount["type"]>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
)

export const sessions = sqliteTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.ID, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	})
)

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



