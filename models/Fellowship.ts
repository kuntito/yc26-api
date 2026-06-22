import { FellowshipEntity } from "../schemas/fellowship-schema";

export type Fellowship = {
    fellowshipId: number;
    fellowshipName: string;
}

export const toFellowshipFromEntity = (
    fellowshipEntity: FellowshipEntity,
): Fellowship => {
    return {
        fellowshipId: fellowshipEntity.fellowshipId,
        fellowshipName: fellowshipEntity.fellowshipName,
    }
}