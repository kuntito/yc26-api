import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const unitTableName = 'unit';
export const unitTable = pgTable(unitTableName, {
    unitId: serial("id")
        .primaryKey(),
    unitName: text("name")
        .notNull(),
    unitDuties: text("duties")
});

export type UnitEntity = typeof unitTable.$inferSelect;
export type UnitInsertEntity = typeof unitTable.$inferInsert;