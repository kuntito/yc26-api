import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const countryCodeTN = "country_code";
export const countryCodeTable = pgTable(countryCodeTN, {
    countryCodeId: serial("id")
        .primaryKey(),
    countryCode: text("code")
        .notNull(),
    countryName: text("name")
        .notNull(),
});

export type CountryCodeEntity = typeof countryCodeTable.$inferSelect;
export type CountryCodeInsertEntity = typeof countryCodeTable.$inferInsert;