import { ycDb } from "../../clients/dbClient";
import { branchTable } from "../../schemas/branch-schema";
import { CoordinatorInsertEntity, coordinatorsTable } from "../../schemas/coordinators-schema";
import { genderTable } from "../../schemas/gender-schema";
import { lodgeOptionTable } from "../../schemas/lodgeOption-schema";
import { eq } from "drizzle-orm";
import { capitalize, logDbError, sendEmail } from "../../util/helpers";


interface CoordinatorDetails {
    firstName: string;
    lastName: string;
    email: string;
    genderId: number;
    branchId: number;
    lodgeOptionId: number;
}

type CoordinatorDetailsValidation = 
    | { 
        isValid: true;
        details: CoordinatorDetails
    }
    | {
        isValid: false;
        reason: string;
    }

export const validateCoordinatorDetails = (
    body: any
): CoordinatorDetailsValidation => {
    if (body == undefined) {
        return { 
            isValid: false, 
            reason: "coordinator details are missing" 
        };
    }

    const {
        firstName,
        lastName,
        email,
        genderId: genderIdStr,
        branchId: branchIdStr,
        lodgeOptionId: lodgeOptionIdStr,
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

    const genderId = Number(genderIdStr);
    if (isNaN(genderId)) {
        return {
            isValid: false,
            reason: "can't register, invalid gender",
        };
    }

    const branchId = Number(branchIdStr);
    if (isNaN(branchId)) {
        return {
            isValid: false,
            reason: "can't register, invalid branch",
        };
    }

    const lodgeOptionId = Number(lodgeOptionIdStr);
    if (isNaN(lodgeOptionId)) {
        return {
            isValid: false,
            reason: "can't register, invalid lodge",
        };
    }

    return {
        isValid: true,
        details: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            genderId: genderId,
            branchId: branchId,
            lodgeOptionId: lodgeOptionId,
        }
    }
}

export type RegisteredCoordinatorDetails = {
    coordinatorId: number;
    firstName: string;
    lastName: string;
    email: string;
    genderName: string;
    branchName: string;
    lodgeOptionId: number;
    lodgeOptionText: string;
};

export const registerCoordinator = async (
    coordinatorDetails: CoordinatorDetails,
): Promise<RegisteredCoordinatorDetails | null> => {
    try {
        const coordinator: CoordinatorInsertEntity = {
            firstName: coordinatorDetails.firstName,
            lastName: coordinatorDetails.lastName,
            email: coordinatorDetails.email,
            genderId: coordinatorDetails.genderId,
            branchId: coordinatorDetails.branchId,
            lodgeOptionId: coordinatorDetails.lodgeOptionId,
        };

        await ycDb
            .insert(coordinatorsTable)
            .values(coordinator);

        const rows = await ycDb
            .select({
                coordinatorId: coordinatorsTable.coordinatorId,
                firstName: coordinatorsTable.firstName,
                lastName: coordinatorsTable.lastName,
                email: coordinatorsTable.email,
                genderName: genderTable.genderName,
                branchName: branchTable.branchName,
                lodgeOptionId: lodgeOptionTable.lodgeOptionId,
                lodgeOptionText: lodgeOptionTable.lodgeOptionText,
            })
            .from(coordinatorsTable)
            .innerJoin(
                genderTable,
                eq(
                    coordinatorsTable.genderId,
                    genderTable.genderId,
                )
            )
            .innerJoin(
                branchTable,
                eq(
                    coordinatorsTable.branchId,
                    branchTable.branchId,
                )
            )
            .innerJoin(
                lodgeOptionTable,
                eq(
                    coordinatorsTable.lodgeOptionId,
                    lodgeOptionTable.lodgeOptionId,
                )
            )
            .where(
                eq(
                    coordinatorsTable.email,
                    coordinatorDetails.email,
                )
            )
            .limit(1);

        if (rows.length === 0) return null;

        return rows[0];
    } catch (e) {
        logDbError(
            `couldn't register coordinator with email=${coordinatorDetails.email}`,
            e,
        );
    }

    return null;
};


export const checkCoordEmailExists = async (
    email: string,
): Promise<boolean | null> => {
    try {
        const rows = await ycDb
            .select({ 
                email: coordinatorsTable.email 
            })
            .from(coordinatorsTable)
            .where(
                eq(
                    coordinatorsTable.email,
                    email
                )
            )
            .limit(1);

        return rows.length > 0;
    } catch (e) {
        logDbError(
            `couldn't check if coordinator email exists, ${email}`,
            e,
        );
    }
    return null;
};


export const constructCoordinationConfirmationMail = (
    firstName: string,
    lastName: string,
    needsLodgeArrangement: boolean,
): string => {

    const needsLodgeText = needsLodgeArrangement 
        ? "\n<p>we would make lodging arrangements for you and communicate the details.</p>\n"
        : "";

    const messageTemplate = `
    <div style="position: relative; font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #F9F9F9;">
        <img 
            src="https://camp26-eight.vercel.app/algc_logo.png"
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; opacity: 0.18; pointer-events: none;"
        />
        <p>pleasant greetings, <strong style="font-weight: bold; color: #00003F;">${firstName} ${lastName}</strong></p>

        <p>you're registered as a <strong>coordinator</strong> for <strong>Abundant Life's Youth Camp, 2026</strong>.</p>
        ${needsLodgeText}
        <p>see you at camp.</p>

        <p style="font-weight: bold; color: #00003F;">
            Registration Team, Life Champions<br/>
            Ibadan.
        </p>
    </div>
    `

    return messageTemplate;
}


export const sendMailCoordRegConfirmation = async (
    details: RegisteredCoordinatorDetails,
): Promise<boolean> => {
    const firstName = capitalize(details.firstName);
    const lastName = capitalize(details.lastName);

    const to = details.email;
    const subject = "Registration Confirmation";

    // FIXME, at time of writing, this corresponds to make lodge arrangements
    const needsLodgeArrangement = details.lodgeOptionId === 2;

    const emailMessage = constructCoordinationConfirmationMail(
        firstName,
        lastName,
        needsLodgeArrangement,
    )

    try {
        await sendEmail(
            to,
            subject,
            emailMessage,
        )

        console.log(`confirmation mail sent to: ${details.email}`);
        
        return true;
    } catch (e) {
        console.error(
            `couldn't send registration email, userId = ${details.coordinatorId}, email=${details.email}`, 
            e
        );
    }
    return false;
}