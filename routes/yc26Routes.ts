import express from "express";
import { getRegDropdownsRh } from "./requestHandlers/getRegDropdownsRh";
import {  registerCamperRh } from "./requestHandlers/registerCamperRh";
import { getCamperProfileRh } from "./requestHandlers/getCamperProfile.rh";
import { getRegStatusRh } from "./requestHandlers/getRegStatus.rh";

const yc26Router = express.Router();

yc26Router.get(
    '/getRegDropdowns',
    getRegDropdownsRh,
)

yc26Router.post(
    '/register',
    registerCamperRh,
);

yc26Router.get(
    '/camper-profile/:camperMail',
    getCamperProfileRh
)

yc26Router.get(
    '/reg-status',
    getRegStatusRh
)

export default yc26Router;