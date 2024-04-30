import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
    host: process.env["DB_HOST"],
    port: 5432,
    user: process.env["DB_USER"],
    password: process.env["DB_PASS"],
    database: process.env["DB_NAME"],
    ssl: true
});

export const db = drizzle(pool, { schema });