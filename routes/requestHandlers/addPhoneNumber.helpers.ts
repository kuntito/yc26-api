import { and, eq, isNull } from "drizzle-orm";
import { ycDb } from "../../clients/dbClient";
import { registrantsTable } from "../../schemas/registrants-schema";
import { AddPhoneNumberReqBody } from "./addPhoneNumber.rh";
import { logDbError } from "../../util/helpers";

type AddPhoneNumberValidation =
    | {
        isValid: true;
        reqBody: AddPhoneNumberReqBody
    }
    | {
        isValid: false;
        reason: string;
    }

export const validateReqBody = (
    reqBody: any
): AddPhoneNumberValidation => {
    if ( reqBody == undefined ) {
        return {
            isValid: false,
            reason: "request body is missing"
        };
    }

    const {
        phoneNumber,
        camperId: camperIdStr
    } = reqBody;


    const camperId = Number(camperIdStr);
    if (isNaN(camperId)) {
        return {
            isValid: false,
            reason: "camper id is NaN",
        };
    }

    
    if (!phoneNumber?.trim()) {
        return {
            isValid: false,
            reason: "can't register, no whatsapp phone number",
        }
    }

    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!phoneRegex.test(phoneNumber.trim().replace(/\s+/g, ""))) {
        return {
            isValid: false,
            reason: "can't register, whatsapp phone number should be 9-15 digits",
        };
    }

    return {
        isValid: true,
        reqBody: {
            phoneNumber: phoneNumber,
            camperId: camperId,
        }
    }
}

/**
 * updates a camper's phone number.
 */
export const insertPhoneNumber = async (
    camperId: number,
    phoneNumber: string,
): Promise<boolean> => {
    try {
        const rowsAffected = await ycDb
            .update(registrantsTable)
            .set({
                phoneNumber: phoneNumber,
            })
            .where(
                and(
                    eq(
                        registrantsTable.registrantId,
                        camperId,
                    ),
                    isNull(
                        registrantsTable.phoneNumber,
                    ),
                )
            );

        return rowsAffected.rowCount == 1;
    } catch (e) {
        logDbError(
            `couldn't insert phone number, camperId=${camperId}`,
            e,
        );
    }

    return false;
};