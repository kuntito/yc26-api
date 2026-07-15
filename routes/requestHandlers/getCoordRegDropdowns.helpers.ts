import { ycDb } from "../../clients/dbClient";
import { BranchEntity, branchTable } from "../../schemas/branch-schema";
import { GenderEntity, genderTable } from "../../schemas/gender-schema";
import { LodgeOptionEntity, lodgeOptionTable } from "../../schemas/lodgeOption-schema";
import { logDbError } from "../../util/helpers";

export type CoordRegDropdowns = {
    genderEntities: GenderEntity[];
    branchEntities: BranchEntity[];
    lodgeOptionEntities: LodgeOptionEntity[];
}

let cachedCoordDropdowns: CoordRegDropdowns | null = null;

/**
 * fetches all dropdown data needed for the coordinator registration form.
 * returns null if anything fails.
 */
export const getCoordRegDropdowns = async (): Promise<CoordRegDropdowns | null> => {
    if (cachedCoordDropdowns != null) return cachedCoordDropdowns;

    try {
        const [
            genderEntities,
            branchEntities,
            lodgeOptionEntities
        ] = await Promise.all([
            ycDb
                .select()
                .from(genderTable),
            ycDb
                .select()
                .from(branchTable),
            ycDb
                .select()
                .from(lodgeOptionTable),
        ]);

        cachedCoordDropdowns = {
            genderEntities: genderEntities,
            branchEntities: branchEntities,
            lodgeOptionEntities: lodgeOptionEntities,
        };

        return cachedCoordDropdowns;
    } catch (e) {
        logDbError(
            `couldn't fetch coord reg dropdowns`,
            e
        );
    }

    return null;
}