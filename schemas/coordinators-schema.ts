import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const coordinatorsTN = "coordinators";
export const coordinatorsTable = pgTable(coordinatorsTN, {
    coordinatorId: serial("id")
        .primaryKey(),
    firstName: text("first_name")
        .notNull(),
    lastName: text("last_name")
        .notNull(),
    email: text("email")
        .notNull()
        .unique(),
    genderId: integer("gender_id")
        .notNull(),
    branchId: integer("branch_id")
        .notNull(),
    lodgeOptionId: integer("lodge_option_id")
        .notNull(),
});

export type CoordinatorEntity = typeof coordinatorsTable.$inferSelect;
export type CoordinatorInsertEntity = typeof coordinatorsTable.$inferInsert;