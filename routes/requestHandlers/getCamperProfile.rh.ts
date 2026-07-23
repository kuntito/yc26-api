import { Request, Response } from "express";
import { RegisteredCamperDetails } from "./registerCamperHelpers";
import { getCamperProfile } from "./getCamperProfile.helpers";

export type CamperProfile = {
    camperId: number;
    firstName: string;
    lastName: string;
    genderName: string;
    branchName: string;
    fellowshipName: string;
    unitName: string;
    unitDutiesMdText: string | null;
    isRegPhoneNumber: boolean;
    familyName: string | null;
    familyInfoMdText: string | null;
}

type CamperProfileResponse = 
    | {
        success: true;
        profile: CamperProfile;
    }
    | {
        success: false;
        clientMessage?: string;
        debug?: object;
    }

const getCamperProfileRh = async (
    req: Request,
    res: Response<CamperProfileResponse>
) => {
    const { camperMail } = req.params;
    if (camperMail == undefined) {
        return res
            .status(400)
            .json({
                success: false,
                clientMessage: "email is required",
            });
    }

    const camperProfileRes = await getCamperProfile(camperMail as string);

    switch(camperProfileRes.kind) {
        case 'no record':
            return res
                .status(404)
                .json({
                    success: false,
                    clientMessage: `that's not your registration email`,
                });
        case 'db error':
            return res
                .status(404)
                .json({
                    success: false,
                    clientMessage: `sumn' wrong.`
                })
        case 'has record':
            return res
                .status(200)
                .json({
                    success: true,
                    profile: camperProfileRes.profile
                })
    }
}

export { getCamperProfileRh };