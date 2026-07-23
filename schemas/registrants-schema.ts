import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { genderTable } from "./gender-schema";
import { branchTable } from "./branch-schema";
import { fellowshipTable } from "./fellowship-schema";
import { unitTable } from "./unit-schema";
import { familyTable } from "./family-schema";

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
        .notNull()
        .references(() => genderTable.genderId),
    branchId: integer("branch_id")
        .notNull()
        .references(() => branchTable.branchId),
    fellowshipId: integer("fellowship_id")
        .notNull()
        .references(() => fellowshipTable.fellowshipId),
    unitId: integer("unit_id")
        .notNull()
        .references(() => unitTable.unitId),
    phoneNumber: text("phone_number"),
    familyId: integer("family_id")
        .references(() => familyTable.familyId),
    isAvailable: boolean("is_available")
        .notNull()
        .default(true),
});

export type RegistrantEntity = typeof registrantsTable.$inferSelect;
export type RegistrantInsertEntity = typeof registrantsTable.$inferInsert;