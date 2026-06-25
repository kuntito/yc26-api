import { count } from "drizzle-orm";
import { ycDb } from "../clients/dbClient";
import { registrantsTable } from "../schemas/registrants-schema";
import { Resend } from "resend";
import { envConfig } from "../envConfig";

/**
 * formats db error messages on new line.
 * and logs on the console.
 *
 * e.g. \
 * \* \
 * could not run `isDbTableEmpty` for table: nextSong \
 * errorMessage: Failed query... \
 * db error: column "posInQueue" does not exist \
 * \*
 */
export const logDbError = (message: string, e: unknown) => {
    const constructedMessage = "*" +
        "\n" +
        message + 
        "\n" +
        "errorMessage: " + (e as Error).message +
        "\n" +
        "db error: " + (e as any)?.cause +
        "\n" +
        "*";

    console.log(constructedMessage);
}


export const initRegistrantCount = async (

): Promise<number | null> => {
    try {
        const rows = await ycDb
            .select({
                count: count(
                    registrantsTable.registrantId
                )
            })
            .from(registrantsTable)

        return rows[0].count;
    } catch (e) {
        logDbError(
            "couldn't fetch registrants count",
            e
        );
    }
    return null;
}


export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
): Promise<void> => {
    const resend = new Resend(
        envConfig.RESEND_API_KEY
    );

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: subject,
        html: html
    });
}

/**
 * Capitalizes the first character of a string, leaving the rest unchanged.
 *
 * @param str - The string to capitalize.
 * @returns The string with its first character uppercased, or the original
 *          value if it's empty.
 *
 * @example
 * capitalize("tito"); // "Tito"
 * capitalize("media team"); // "Media team"
 * capitalize(""); // ""
 */
export const capitalize = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};