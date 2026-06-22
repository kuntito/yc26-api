import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const fellowshipTableName = 'fellowship';
export const fellowshipTable = pgTable(fellowshipTableName, {
    fellowshipId: serial("id")
        .primaryKey(),
    fellowshipName: text("name")
        .notNull(),
});

export type FellowshipEntity = typeof fellowshipTable.$inferSelect;
export type FellowshipInsertEntity = typeof fellowshipTable.$inferInsert;