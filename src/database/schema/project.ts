import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ticket } from "./ticket";

export const project = pgTable("project", {
    id: serial("id").primaryKey(),
	name: varchar("name", { length: 16 }),
	description: varchar("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

export const projectRelations = relations(project, ({ many }) => ({
	tickets: many(ticket)
}));