import express from "express";
import { getRegDropdownsRh } from "./requestHandlers/getRegDropdownsRh";
import {  registerCamperRh } from "./requestHandlers/registerCamperRh";

const yc26Router = express.Router();

yc26Router.get(
    '/getRegDropdowns',
    getRegDropdownsRh,
)

yc26Router.post(
    '/register',
    registerCamperRh,
);

export default yc26Router;