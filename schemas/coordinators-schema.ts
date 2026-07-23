import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { genderTable } from "./gender-schema";
import { branchTable } from "./branch-schema";
import { lodgeOptionTable } from "./lodgeOption-schema";

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
        .notNull()
        .references(() => genderTable.genderId),
    branchId: integer("branch_id")
        .notNull()
        .references(() => branchTable.branchId),
    lodgeOptionId: integer("lodge_option_id")
        .notNull()
        .references(() => lodgeOptionTable.lodgeOptionId),
});

export type CoordinatorEntity = typeof coordinatorsTable.$inferSelect;
export type CoordinatorInsertEntity = typeof coordinatorsTable.$inferInsert;