import { checkCoordEmailExists, registerCoordinator, RegisteredCoordinatorDetails, sendMailCoordRegConfirmation, validateCoordinatorDetails } from "./registerCoordinator.helpers";
import { Request, Response } from "express";


type RegisterCoordinatorResponse = 
    | {
        success: true;
        registeredCoordinatorDetails: RegisteredCoordinatorDetails;
    }
    | {
        success: false;
        clientMessage?: string;
        debug: object;
    }

    const registerCoordinatorRh = async (
        req: Request,
        res: Response<RegisterCoordinatorResponse>
    ) => {
        const validationRes = validateCoordinatorDetails(req.body);
        if (!validationRes.isValid) {
            return res
                .status(400)
                .json({
                    success: false,
                    clientMessage: validationRes.reason,
                    debug: {
                        errorMessage: "coordinator details validation failed."
                    }
                })
        }
    
        const registeredCoordinatorDetails = await registerCoordinator(validationRes.details);
    
        if (registeredCoordinatorDetails == null) {
            const emailAlreadyExists = await checkCoordEmailExists(
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
                        errorMessage: "couldn't register coordinator"
                    }
                })
        }
    
        res
            .status(200)
            .json({
                success: true,
                registeredCoordinatorDetails: registeredCoordinatorDetails
            })
    
        await sendMailCoordRegConfirmation(
            registeredCoordinatorDetails
        )
    }
    
    export { registerCoordinatorRh };