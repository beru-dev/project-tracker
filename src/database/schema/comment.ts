import { foreignKey, integer, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { ticket } from "./ticket";

export const comment = pgTable(
    "comment",
    {
        id: serial("id").primaryKey(),
        content: varchar("content"),
        userId: integer("user_id").notNull().references(() => user.id),
        ticketNumber: integer("ticket_number"),
        ticketProjectId: integer("ticket_project_id"),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
    },
    (table) => ({
        ticket: foreignKey({
            columns: [table.ticketNumber, table.ticketProjectId],
            foreignColumns: [ticket.ticketNumber, ticket.projectId]
        })
    })
);

export const commentRelations = relations(comment, ({ one }) => ({
	authorId: one(user, { fields: [comment.userId], references: [user.id], relationName: "author" }),
	ticketId: one(ticket, { fields: [comment.ticketNumber, comment.ticketProjectId], references: [ticket.ticketNumber, ticket.projectId], relationName: "ticket" })
}));