import express from "express";
import { getRegDropdownsRh } from "./requestHandlers/getRegDropdownsRh";

const yc26Router = express.Router();

yc26Router.get(
    '/getRegDropdowns',
    getRegDropdownsRh,
)

export default yc26Router;