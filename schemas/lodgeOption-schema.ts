import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const lodgeOptionTN = "lodge_option";
export const lodgeOptionTable = pgTable(lodgeOptionTN, {
    lodgeOptionId: serial("id")
        .primaryKey(),
    lodgeOptionText: text("text")
        .notNull(),
});

export type LodgeOptionEntity = typeof lodgeOptionTable.$inferSelect;
export type LodgeOptionInsertEntity = typeof lodgeOptionTable.$inferInsert;