** PROJECT-SETUP **

+   to setup the project in cwd:
    `npm init -y`

    this creates a `package.json` file

+   to setup repo:
    `git init`

+   create `/.gitignore`
    add:
`
node_modules
.env
.cursorrules
.vscode/settings.json
tg.ts
dist/*
`

    
+   web framework for handling routes:
    `npm install express`
    `npm install -D @types/express`

    
+   typescript support:
    `npm install -D typescript`
    `npm install -D ts-node`


+   enables cross-origin requests, allows you specify what hosts can access this API:
    `npm install cors`
    `npm install -D @types/cors`

+   loads environment variables from .env file:
    `npm install dotenv`

+   auto-restarts server on file changes:
    `npm install -D nodemon`

+   in project root, create `tsconfig.json`
    copy content from my google drive `G:\My Drive\0\tsconfig.json`

+   in project root, create dir, `routes/yc26Routes.ts`
    where `yc26` is the app name.

    inside, `yc26Routes.ts`, add:
`
import express from "express";

const yc26Router = express.Router();

// routes go here...

export default yc26Router;
`

+   in project root, 
        create `.env`

+   in project root,
        create `envConfig.ts`
        copy content from my google drive `G:\My Drive\0\envConfig.ts`

+   go to `package.json`, ensure the scripts tag looks like:

`
{
    ...,
    "scripts": {
        ...,
        "dev": "nodemon server.ts",
        "build": "tsc",
        "start": "node dist/server.js"
    },
    ...
}
`

    `nodemon` is the command.
    `server.ts` is the relative file path

+   in project root, create `server.ts`

+   in `server.ts`, add:
`
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
`