import { LodgeOptionEntity } from "../schemas/lodgeOption-schema";

export type LodgeOption = {
    lodgeOptionId: number,
    lodgeOptionText: string;
};

export const toLodgeOptionFromEntity = (
    lodgeOptionEntity: LodgeOptionEntity
): LodgeOption => {
    return {
        lodgeOptionId: lodgeOptionEntity.lodgeOptionId,
        lodgeOptionText: lodgeOptionEntity.lodgeOptionText,
    }
};