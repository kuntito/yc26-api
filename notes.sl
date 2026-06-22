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


** NEON DB SETUP **


+   create acount:
    `https://neon.tech`

+   create new project:
    - postgres version: 18 (default)
    - cloud service: AWS (default)
    - region: default

+   click `Connect`
    a dialog'd appear

    with a text like:
    `psql 'postgresql://...'`

    everything within the single quotes is your connection string.
    i.e. `postgresql://...`

    add to your `.env`
    `NEON_CONN_STR=postgresql://...`

    add `NEON_CONN_STR` to the array, `requiredVariables` in `envConfig.ts`

DEPENDENCIES

+   postgres client for node.js:
    `npm i pg`

+   ts type definitions for `pg`:
    `npm i -D @types/pg`

+   next, setup drizzle.
    it serves a single source of truth for the SQL schema
    and TS types.

    you define the schema once, drizzle infers the types.

    `npm install drizzle-orm`
    `npm install -D drizzle-kit`

DEPENDENCIES END

+   in project root, create dir, `schemas`

+   in project root, create `drizzle.config.ts`,
    add:
`
import { defineConfig } from 'drizzle-kit';
import { envConfig } from './envConfig';

export default defineConfig({
    schema: "./schemas/*.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: envConfig.NEON_CONN_STR
    }
});
`

CREATING A TABLE
+   creating a table looks like, see: `.\schemas\branch-schema.ts`

`
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const branchTableName = 'branch';
export const branchTable = pgTable(branchTableName, {
    branchId: serial("id")
        .primaryKey(),
    branchName: text("name")
        .notNull(),
});

export type BranchEntity = typeof branchTable.$inferSelect;
export type BranchInsertEntity = typeof branchTable.$inferInsert;
`

+   then in terminal, create the tables in your neon account:
    `npx drizzle-kit push`

CREATING DB CLIENT
    allows you interact with the db.

in root, create, `clients/dbClient.ts`

add:

`
import { Pool } from "pg";
import { envConfig } from "../envConfig";
import { drizzle } from "drizzle-orm/node-postgres";

export const neonDbClient = new Pool({
    connectionString: envConfig.NEON_CONN_STR,
    // encrypts connection, skips certificate verification (acceptable for personal app)
    ssl: { rejectUnauthorized: false },
});

export const ycDb = drizzle(neonDbClient);
`

in root, create: `util/helpers.ts`

add:
`
/**
 * formats db error messages on new line.
 * and logs on the console.
 *
 * e.g. \
 * \* \
 * could not run `isDbTableEmpty` for table: nextSong \
 * errorMessage: Failed query... \
 * db error: column "posInQueue" does not exist \
 * \*
 */
export const logDbError = (message: string, e: unknown) => {
    const constructedMessage = "*" +
        "\n" +
        message + 
        "\n" +
        "errorMessage: " + (e as Error).message +
        "\n" +
        "db error: " + (e as any)?.cause +
        "\n" +
        "*";

    console.log(constructedMessage);
}
`