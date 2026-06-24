import { GenderEntity } from "../schemas/gender-schema";

export type Gender = {
    genderId: number;
    genderName: string;
};

export const toGenderFromEntity = (
    genderEntity: GenderEntity
): Gender => {
    return {
        genderId: genderEntity.genderId,
        genderName: genderEntity.genderName
    };
};