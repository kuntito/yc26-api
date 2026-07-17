import { ycDb } from "../../clients/dbClient";
import { BranchEntity, branchTable } from "../../schemas/branch-schema";
import { CountryCodeEntity, countryCodeTable } from "../../schemas/countryCode-schema";
import { FellowshipEntity, fellowshipTable } from "../../schemas/fellowship-schema";
import { GenderEntity, genderTable } from "../../schemas/gender-schema";
import { UnitEntity, unitTable } from "../../schemas/unit-schema";
import { logDbError } from "../../util/helpers";

export type RegDropdowns = {
    genderEntities: GenderEntity[];
    branchEntities: BranchEntity[];
    fellowshipEntities: FellowshipEntity[];
    unitEntities: UnitEntity[];
    countryCodeEntities: CountryCodeEntity[];
}


let cachedDropdowns: RegDropdowns | null = null;
/**
 * fetches all dropdown data needed for the registration form.
 * returns null if anything fails.
 */
export const getRegDropdowns = async (): Promise<RegDropdowns | null> => {
    if (cachedDropdowns != null) return cachedDropdowns

    try {
        const [
            genderEntities,
            branchEntities,
            fellowshipEntities,
            unitEntities,
            countryCodeEntities,
        ] = await Promise.all([
            ycDb
                .select()
                .from(genderTable),
            ycDb
                .select()
                .from(branchTable),
            ycDb
                .select()
                .from(fellowshipTable),
            ycDb
                .select()
                .from(unitTable),
            ycDb
                .select()
                .from(countryCodeTable),
        ]);

        cachedDropdowns = {
            genderEntities: genderEntities,
            branchEntities: branchEntities,
            fellowshipEntities: fellowshipEntities,
            unitEntities: unitEntities,
            countryCodeEntities: countryCodeEntities,
        }

        return cachedDropdowns;
    } catch (e) {
        logDbError(
            `couldn't fetch reg dropdowns`,
            e
        );
    }

    return null;
}