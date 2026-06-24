import "./envConfig"; // validates environment variables
import express, { Express } from "express";
import cors from 'cors';
import yc26Router from "./routes/yc26Routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { initRegistrantCount as getRegistrantsCount } from "./util/helpers";

const app: Express = express();
const PORT = 5008;

const httpServer = createServer(app);
const io = new Server(
    httpServer,
    {
        cors: {
            origin: "*"
        }
    }
);

const regCountSocketKey = "regCount";
export const broadcastNewRegistrant = async () => {
    const regCount = await getRegistrantsCount() ?? 0;
    io.emit(
        regCountSocketKey,
        regCount
    );
}


io.on("connection", async (socket) => {
    const regCount = await getRegistrantsCount() ?? 0;
    socket.emit(
        regCountSocketKey, 
        regCount,
    );
})

// allows project to parse JSON in request body
app.use(express.json());

// any one can access API routes
app.use(cors());

app.use(
    "/api/yc26",
    yc26Router,
);

httpServer.listen(
    PORT,
    () => {
        console.log(`server started at http://localhost:${PORT}`);
    }
);