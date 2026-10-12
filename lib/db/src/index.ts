import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set. Copy .env.example to .env and fill it in.",
  );
}

/**
 * Hosted Postgres (Supabase, Neon, Render...) needs TLS. Turn it on when
 * DATABASE_SSL=true, or automatically for *.supabase.co / *.supabase.com hosts.
 * Local databases keep a plain connection.
 */
const wantsSsl =
  process.env.DATABASE_SSL === "true" ||
  (process.env.DATABASE_SSL !== "false" &&
    /supabase\.(co|com)/i.test(connectionString));

export const pool = new Pool({
  connectionString,
  ssl: wantsSsl ? { rejectUnauthorized: false } : undefined,
  max: Number(process.env.DATABASE_POOL_MAX ?? 10),
});
export const db = drizzle(pool, { schema });

export * from "./schema";
