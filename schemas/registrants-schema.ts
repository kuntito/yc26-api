import { pgTable, serial, text, integer, pgEnum } from "drizzle-orm/pg-core";

export const registrantsTN = "registrants";
export const registrantsTable = pgTable(registrantsTN, {
    registrantId: serial("id")
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
    fellowshipId: integer("fellowship_id")
        .notNull(),
    unitId: integer("unit_id")
        .notNull(),
});

export type RegistrantEntity = typeof registrantsTable.$inferSelect;
export type RegistrantInsertEntity = typeof registrantsTable.$inferInsert;