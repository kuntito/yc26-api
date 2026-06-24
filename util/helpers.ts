import { count } from "drizzle-orm";
import { ycDb } from "../clients/dbClient";
import { registrantsTable } from "../schemas/registrants-schema";

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