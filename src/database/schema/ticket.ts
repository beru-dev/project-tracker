import { date, /*foreignKey,*/ integer, pgEnum, pgTable, primaryKey, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { comment } from "./comment";
import { project } from "./project";

export const ticketStatusEnum = pgEnum("ticket_status", ["to do", "working", "done", "abandoned", "blocked"]);

export const ticket = pgTable(
    "ticket",
    {
        ticketNumber: integer("ticket_number").primaryKey(),
        projectId: integer("project_id").primaryKey().references(() => project.id),
        title: varchar("title", { length: 255 }).notNull(),
        description: varchar("description"),
        points: integer("points"),
        status: ticketStatusEnum("status").notNull().default("to do"),
        due: date("due"),
        creatorId: integer("creator_id").notNull().references(() => user.id),
        assigneeId: integer("assignee_id").references(() => user.id),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
    },
    (table) => ({
        pk: primaryKey({
            columns: [table.ticketNumber, table.projectId]
        })
    })
);

export const ticketRelations = relations(ticket, ({ one, many }) => ({
	assignedUser: one(user, { fields: [ticket.assigneeId], references: [user.id], relationName: "assigned_user" }),
	creator: one(user, { fields: [ticket.creatorId], references: [user.id], relationName: "creator" }),
	comments: many(comment)
}));