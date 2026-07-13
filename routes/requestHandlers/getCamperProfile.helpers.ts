import { count, eq } from "drizzle-orm";
import { ycDb } from "../../clients/dbClient";
import { branchTable } from "../../schemas/branch-schema";
import { fellowshipTable } from "../../schemas/fellowship-schema";
import { genderTable } from "../../schemas/gender-schema";
import { registrantsTable } from "../../schemas/registrants-schema";
import { unitTable } from "../../schemas/unit-schema";
import { CamperProfile } from "./getCamperProfile.rh";
import { logDbError } from "../../util/helpers";


export type GetCamperProfileResult =
    | { kind: 'has record', profile: CamperProfile }
    | { kind: 'no record' }
    | { kind: 'db error' }


export const getCamperProfile = async (
    camperMail: string,
): Promise<GetCamperProfileResult> => {
    try {
        const rows = await ycDb
            .select({
                camperId: registrantsTable.registrantId,
                firstName: registrantsTable.firstName,
                lastName: registrantsTable.lastName,
                genderName: genderTable.genderName,
                branchName: branchTable.branchName,
                fellowshipName: fellowshipTable.fellowshipName,
                unitName: unitTable.unitName,
                unitDutiesMdText: unitTable.unitDuties,
            })
            .from(registrantsTable)
            .innerJoin(
                genderTable,
                eq(
                    registrantsTable.genderId,
                    genderTable.genderId,
                )
            )
            .innerJoin(
                branchTable,
                eq(
                    registrantsTable.branchId,
                    branchTable.branchId,
                )
            )
            .innerJoin(
                fellowshipTable,
                eq(
                    registrantsTable.fellowshipId,
                    fellowshipTable.fellowshipId,
                )
            )
            .innerJoin(
                unitTable,
                eq(
                    registrantsTable.unitId,
                    unitTable.unitId,
                )
            )
            .where(
                eq(
                    registrantsTable.email,
                    camperMail,
                )
            )
            .limit(1);

        if (rows.length === 0) {
            return { kind: 'no record' };
        }

        return {
            kind: 'has record',
            profile: rows[0],
        };
    } catch (e) {
        logDbError(
            `couldn't fetch camper profile, email=${camperMail}`,
            e,
        );
    }

    return { kind: 'db error' };
};


