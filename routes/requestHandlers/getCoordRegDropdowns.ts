import { Request, RequestHandler, Response } from "express";
import { Branch, toBranchFromEntity } from "../../models/Branch";
import { Gender, toGenderFromEntity } from "../../models/Gender";
import { LodgeOption, toLodgeOptionFromEntity } from "../../models/LodgeOption";
import { getCoordRegDropdowns } from "./getCoordRegDropdowns.helpers";


type GetCoordRegDropdownsResponse = 
    | {
        success: true;
        // TODO should bundle all as part one object
        genders: Gender[];
        branches: Branch[];
        lodgeOptions: LodgeOption[];
    }
    | {
        success: false;
        debug: object;
    }


const getCoordRegDropdownsRh = async (
    req: Request,
    res: Response<GetCoordRegDropdownsResponse>
) => {
    const coordRegDropdowns = await getCoordRegDropdowns();

    if (coordRegDropdowns == null) {
        return res
            .status(500)
            .json({
                success: false,
                debug: {
                    errorMessage: "couldn't fetch coordinator registration dropdowns"
                }
            });
    } else {
        return res
            .status(200)
            .json({
                success: true,
                genders: coordRegDropdowns.genderEntities.map(toGenderFromEntity),
                branches: coordRegDropdowns.branchEntities.map(toBranchFromEntity),
                lodgeOptions: coordRegDropdowns.lodgeOptionEntities.map(toLodgeOptionFromEntity),
            });
    }
}

export { getCoordRegDropdownsRh };