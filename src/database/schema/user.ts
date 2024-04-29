import { pgEnum, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ticket } from "./ticket";
import { comment } from "./comment";


export const userRoleEnum = pgEnum("user_role", ["guest", "user", "admin"]);

export const user = pgTable("user_", {
    id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	role: userRoleEnum("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

export const userRelations = relations(user, ({ many }) => ({
	assignedTicket: many(ticket, { relationName: "assigned_tickets" }),
	createdTickets: many(ticket, { relationName: "created_tickets" }),
	userToComments: many(comment)
}));