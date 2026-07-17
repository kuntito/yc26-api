import { Request, RequestHandler, Response } from "express";
import { Branch, toBranchFromEntity } from "../../models/Branch";
import { Fellowship, toFellowshipFromEntity } from "../../models/Fellowship";
import { toUnitFromEntity, Unit } from "../../models/Unit";
import { getRegDropdowns } from "./getRegDropdownsHelpers";
import { Gender, toGenderFromEntity } from "../../models/Gender";
import { CountryCode, toCountryCodeFromEntity } from "../../models/CountryCode";


type GetRegDropdownsResponse = 
    | {
        success: true;
        // TODO should bundle all four as part one object
        genders: Gender[];
        branches: Branch[];
        fellowships: Fellowship[];
        units: Unit[];
        countryCodes: CountryCode[];
    }
    | {
        success: false;
        debug: object;
    }


const getRegDropdownsRh = async (
    req: Request,
    res: Response<GetRegDropdownsResponse>
) => {
    const regDropdowns = await getRegDropdowns();

    if (regDropdowns == null) {
        return res
            .status(500)
            .json({
                success: false,
                debug: {
                    errorMessage: "couldn't fetch registration dropdowns"
                }
            });
    } else {
        return res
            .status(200)
            .json({
                success: true,
                genders: regDropdowns.genderEntities.map(toGenderFromEntity),
                branches: regDropdowns.branchEntities.map(toBranchFromEntity),
                fellowships: regDropdowns.fellowshipEntities.map(toFellowshipFromEntity),
                units: regDropdowns.unitEntities.map(toUnitFromEntity),
                countryCodes: regDropdowns.countryCodeEntities.map(toCountryCodeFromEntity),
            });
    }
}

export { getRegDropdownsRh };