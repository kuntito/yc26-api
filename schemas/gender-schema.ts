import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const genderTableName = 'gender';
export const genderTable = pgTable(genderTableName, {
    genderId: serial("id")
        .primaryKey(),
    genderName: text("name")
        .notNull(),
});

export type GenderEntity = typeof genderTable.$inferSelect;
export type GenderInsertEntity = typeof genderTable.$inferInsert;