import { CountryCodeEntity } from "../schemas/countryCode-schema";

export type CountryCode = {
    countryCodeId: number;
    countryCode: string;
    countryName: string;
};

export const toCountryCodeFromEntity = (
    entity: CountryCodeEntity
): CountryCode => {
    return {
        countryCodeId: entity.countryCodeId,
        countryCode: entity.countryCode,
        countryName: entity.countryName
    };
}