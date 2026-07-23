import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const familyTableName = 'family';
export const familyTable = pgTable(familyTableName, {
    familyId: serial("id")
        .primaryKey(),
    familyName: text("name")
        .notNull(),
    familyInfo: text("info")
});

export type FamilyEntity = typeof familyTable.$inferSelect;
export type FamilyInsertEntity = typeof familyTable.$inferInsert;