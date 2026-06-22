import { UnitEntity } from "../schemas/unit-schema";

export type Unit = {
    unitId: number;
    unitName: string;
}

export const toUnitFromEntity = (
    unitEntity: UnitEntity,
): Unit => {
    return {
        unitId: unitEntity.unitId,
        unitName: unitEntity.unitName,
    }
}