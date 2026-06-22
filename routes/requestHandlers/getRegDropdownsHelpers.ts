import { ycDb } from "../../clients/dbClient";
import { BranchEntity, branchTable } from "../../schemas/branch-schema";
import { FellowshipEntity, fellowshipTable } from "../../schemas/fellowship-schema";
import { UnitEntity, unitTable } from "../../schemas/unit-schema";
import { logDbError } from "../../util/helpers";

export type RegDropdowns = {
    branchEntities: BranchEntity[];
    fellowshipEntities: FellowshipEntity[];
    unitEntities: UnitEntity[];
}


/**
 * fetches all dropdown data needed for the registration form.
 * returns null if anything fails.
 */
export const getRegDropdowns = async (): Promise<RegDropdowns | null> => {
    try {
        const [
            branchEntities,
            fellowshipEntities,
            unitEntities
        ] = await Promise.all([
            ycDb
                .select()
                .from(branchTable),
            ycDb
                .select()
                .from(fellowshipTable),
            ycDb
                .select()
                .from(unitTable),
        ]);

        return {
            branchEntities: branchEntities,
            fellowshipEntities: fellowshipEntities,
            unitEntities: unitEntities,
        };
    } catch (e) {
        logDbError(
            `couldn't fetch reg dropdowns`,
            e
        );
    }

    return null;
}