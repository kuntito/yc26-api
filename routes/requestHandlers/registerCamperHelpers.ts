import { ycDb } from "../../clients/dbClient";
import { branchTable } from "../../schemas/branch-schema";
import { fellowshipTable } from "../../schemas/fellowship-schema";
import { RegistrantInsertEntity, registrantsTable } from "../../schemas/registrants-schema";
import { unitTable } from "../../schemas/unit-schema";
import { eq } from "drizzle-orm";
import { logDbError } from "../../util/helpers";


interface CamperDetails {
    firstName: string;
    lastName: string;
    email: string;
    sex: 'male' | 'female';
    branchId: number;
    fellowshipId: number;
    unitId: number;
}


type CamperDetailsValidation = 
    | { 
        isValid: true;
        details: CamperDetails
    }
    | {
        isValid: false;
        reason: string;
    }


export const validateCamperDetails = (
    body: any
): CamperDetailsValidation => {
    if (body == undefined) {
        return { 
            isValid: false, 
            reason: "camper details are missing" };
    }

    const {
        firstName,
        lastName,
        email,
        sex,
        branchId: branchIdStr,
        fellowshipId: fellowshipIdStr,
        unitId: unitIdStr,
    } = body;

    if (!firstName?.trim()) {
        return { 
            isValid: false, 
            reason: "can't register, no first name" 
        };
    }

    if (!lastName?.trim()) {
        return {
            isValid: false,
            reason: "can't register, no last name",
        };
    }

    if (!email?.trim()) {
        return {
            isValid: false,
            reason: "can't register, no email",
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return {
            isValid: false,
            reason: "can't register, email should look like 'sample@email.com'",
        };
    }

    if (!sex?.trim()) {
        return {
            isValid: false,
            reason: "can't register, no sex",
        };
    }


    // TODO, 'male' and 'female' are hardcoded client side
    const validSexValues = ["male", "female"];
    if (!validSexValues.includes(sex.trim().toLowerCase())) {
        return {
            isValid: false,
            reason: "can't register, sex must be 'male' or 'female'",
        };
    }

    const branchId = Number(branchIdStr);
    if (isNaN(branchId)) {
        return {
            isValid: false,
            reason: "can't register, invalid branch",
        };
    }
    
    const fellowshipId = Number(fellowshipIdStr);
    if (isNaN(fellowshipId)) {
        return {
            isValid: false,
            reason: "can't register, invalid fellowship",
        };
    }
    
    const unitId = Number(unitIdStr);
    if (isNaN(unitId)) {
        return {
            isValid: false,
            reason: "can't register, invalid unit",
        };
    }

    return {
        isValid: true,
        details: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            sex: sex.trim().toLowerCase(),
            branchId: branchId,
            fellowshipId: fellowshipId,
            unitId: unitId,
        }
    }
}


export type RegisteredCamperDetails = {
    firstName: string;
    lastName: string;
    email: string;
    sex: string;
    branchName: string;
    fellowshipName: string;
    unitName: string;
};

export const registerCamper = async (
    camperDetails: CamperDetails,
): Promise<RegisteredCamperDetails | null> => {
    try {
        const registrant: RegistrantInsertEntity = {
            firstName: camperDetails.firstName,
            lastName: camperDetails.lastName,
            email: camperDetails.email,
            sex: camperDetails.sex,
            branchId: camperDetails.branchId,
            fellowshipId: camperDetails.fellowshipId,
            unitId: camperDetails.unitId,
        };

        await ycDb
            .insert(registrantsTable)
            .values(registrant);

        const rows = await ycDb
            .select({
                firstName: registrantsTable.firstName,
                lastName: registrantsTable.lastName,
                email: registrantsTable.email,
                sex: registrantsTable.sex,
                branchName: branchTable.branchName,
                fellowshipName: fellowshipTable.fellowshipName,
                unitName: unitTable.unitName,
            })
            .from(registrantsTable)
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
                    camperDetails.email,
                )
            )
            .limit(1);

        if (rows.length === 0) return null;

        return rows[0];
    } catch (e) {
        logDbError(
            `couldn't register camper with email=${camperDetails.email}`,
            e,
        );
    }

    return null;
};


export const checkEmailExists = async (
    email: string,
): Promise<boolean | null> => {
    try {
        const rows = await ycDb
            .select({ 
                email: registrantsTable.email 
            })
            .from(registrantsTable)
            .where(
                eq(
                    registrantsTable.email,
                    email
                )
            )
            .limit(1);

        return rows.length > 0;
    } catch (e) {
        logDbError(
            `couldn't check if email exists, ${email}`,
            e,
        );
    }
    return null;
};