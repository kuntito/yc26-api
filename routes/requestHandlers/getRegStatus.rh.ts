import { getRegCountPerBranch, RegCountPerBranch } from "./getRegStatus.helpers";
import { Request, Response } from "express";

type GetRegStatusResponse =
    | {
        success: true;
        branchCounts: RegCountPerBranch;
    }
    | {
        success: false;
        debug: object;
    }

const getRegStatusRh = async (
    req: Request,
    res: Response<GetRegStatusResponse>
) => {
    const branchCounts = await getRegCountPerBranch();

    if (branchCounts == null) {
        return res
            .status(500)
            .json({
                success: false,
                debug: {
                    errorMessage: "couldn't fetch registration status",
                }
            });
    }

    return res
        .status(200)
        .json({
            success: true,
            branchCounts: branchCounts,
        });
}

export { getRegStatusRh };