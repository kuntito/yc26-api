import { Request, Response } from "express";
import { checkEmailExists, registerCamper, RegisteredCamperDetails, validateCamperDetails } from "./registerCamperHelpers";
import { broadcastNewRegistrant } from "../../server";

type RegisterCamperResponse = 
    | {
        success: true;
        registeredCamperDetails: RegisteredCamperDetails;
    }
    | {
        success: false;
        clientMessage?: string;
        debug: object;
    }

const registerCamperRh = async (
    req: Request,
    res: Response<RegisterCamperResponse>
) => {
    
    const validationRes = validateCamperDetails(req.body);
    if (!validationRes.isValid) {
        return res
            .status(400)
            .json({
                success: false,
                clientMessage: validationRes.reason,
                debug: {
                    errorMessage: "camper details validation failed."
                }
            })
    }


    const registeredCamperDetails = await registerCamper(validationRes.details);
    console.log(`registered camper details, ${JSON.stringify(registeredCamperDetails, null, 2)}`);
    

    if (registeredCamperDetails == null) {
        const emailAlreadyExists = await checkEmailExists(
            validationRes.details.email
        );

        if (emailAlreadyExists) {
            return res
                .status(409)
                .json({
                    success: false,
                    clientMessage: "email already registered",
                    debug: {
                        errorMessage: "duplicate email",
                    },
                });
        }

        return res
            .status(500)
            .json({
                success: false,
                clientMessage: "registration failed",
                debug: {
                    errorMessage: "couldn't register camper"
                }
            })
    }

    res
        .status(200)
        .json({
            success: true,
            registeredCamperDetails: registeredCamperDetails
        })

    await broadcastNewRegistrant();
    
}

export { registerCamperRh };