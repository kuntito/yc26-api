import { ycDb } from "../../clients/dbClient";
import { branchTable } from "../../schemas/branch-schema";
import { registrantsTable } from "../../schemas/registrants-schema";
import { eq, count } from "drizzle-orm";
import { logDbError } from "../../util/helpers";

export type RegCountPerBranch = {
    Oyo: number;
    Lagos: number;
    Kwara: number;
    Kogi: number;
    Ogun: number;
    Edo: number;
}

export const getRegCountPerBranch = async (
): Promise<RegCountPerBranch | null> => {
    try {
        const rows = await ycDb
            .select({
                branchName: branchTable.branchName,
                registrantCount: count(
                    registrantsTable.registrantId
                ),
            })
            .from(branchTable)
            .leftJoin(
                registrantsTable,
                eq(
                    branchTable.branchId,
                    registrantsTable.branchId,
                )
            )
            .groupBy(branchTable.branchName);

        const findCount = (branchName: string): number => {
            const row = rows.find(r => r.branchName === branchName);
            return row?.registrantCount ?? 0;
        };

        return {
            Oyo: findCount("Oyo"),
            Lagos: findCount("Lagos"),
            Kwara: findCount("Kwara"),
            Kogi: findCount("Kogi"),
            Ogun: findCount("Ogun"),
            Edo: findCount("Edo"),
        };
    } catch (e) {
        logDbError(
            "couldn't fetch branch registrant counts",
            e,
        );
    }

    return null;
};