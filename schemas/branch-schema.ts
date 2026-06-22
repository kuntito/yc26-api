import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const branchTableName = 'branch';
export const branchTable = pgTable(branchTableName, {
    branchId: serial("id")
        .primaryKey(),
    branchName: text("name")
        .notNull(),
});

export type BranchEntity = typeof branchTable.$inferSelect;
export type BranchInsertEntity = typeof branchTable.$inferInsert;