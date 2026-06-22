import "./envConfig"; // validates environment variables
import express, { Express } from "express";
import cors from 'cors';
import yc26Router from "./routes/yc26Routes";

const app: Express = express();
const PORT = 5008;

// allows project to parse JSON in request body
app.use(express.json());

// any one can access API routes
app.use(cors());

app.use(
    "/api/yc26",
    yc26Router,
);

app.listen(
    PORT,
    () => {
        console.log(`server started at http://localhost:${PORT}`);
    }
);