import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import fs from "fs";

const pool = new Pool({
    host: process.env["DB_HOST"],
    port: 5432,
    user: process.env["DB_USER"],
    password: process.env["DB_PASS"],
    database: process.env["DB_NAME"],
    ssl: process.env["POSTGRES_SSL"]
        ? { ca: fs.readFileSync("../../us-west-2-bundle.pem").toString() }
        : undefined
});

export const db = drizzle(pool, { schema });