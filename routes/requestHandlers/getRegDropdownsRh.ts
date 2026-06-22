import { Request, RequestHandler, Response } from "express";
import { Branch, toBranchFromEntity } from "../../models/Branch";
import { Fellowship, toFellowshipFromEntity } from "../../models/Fellowship";
import { toUnitFromEntity, Unit } from "../../models/Unit";
import { getRegDropdowns } from "./getRegDropdownsHelpers";


type GetRegDropdownsResponse = 
    | {
        success: true;
        branches: Branch[];
        fellowships: Fellowship[];
        units: Unit[];
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
                branches: regDropdowns.branchEntities.map(toBranchFromEntity),
                fellowships: regDropdowns.fellowshipEntities.map(toFellowshipFromEntity),
                units: regDropdowns.unitEntities.map(toUnitFromEntity),
            });
    }
}

export { getRegDropdownsRh };