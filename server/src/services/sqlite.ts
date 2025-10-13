import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

// create (or open) the sqlite file (in root or some folder)
const sqliteDB = new Database("dev.sqlite");

// create drizzle instance using that client
const sqlite = drizzle(sqliteDB);

export default sqlite;
