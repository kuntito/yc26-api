import { Request, Response } from "express";
import { insertPhoneNumber, validateReqBody } from "./addPhoneNumber.helpers";

export interface AddPhoneNumberReqBody {
    phoneNumber: string;
    camperId: number;
}

type AddPhoneNumberResponse = 
    | {
        success: true;
    }
    | {
        success: false;
        clientMessage?: string;
        debug?: object;
    }

const addPhoneNumberRh = async (
    req: Request,
    res: Response<AddPhoneNumberResponse>
) => {

    const validationRes = validateReqBody(req.body);
    if (!validationRes.isValid) {
        return res
            .status(400)
            .json({
                success: false,
                clientMessage: "something went wrong.",
                debug: {
                    errorMessage: "phone number validation failed"
                }
            })
    }

    const { camperId, phoneNumber } = validationRes.reqBody;
    const isInserted = await insertPhoneNumber(
        camperId,
        phoneNumber
    );
    
    if (!isInserted) {
        return res
            .status(500)
            .json({
                success: false,
                debug: {
                    errorMessage: "couldn't insert phone number"
                }
            });
    }

    return res
        .status(200)
        .json({
            success: true
        });
}

export { addPhoneNumberRh };