import fs from "node:fs";
import path from "node:path";
import { pool } from "@workspace/db";
import { logger } from "./logger";

/**
 * First-start database setup.
 *
 * With AUTO_SETUP_DB=true the API makes sure the tables exist and loads the
 * reference data (schemes, audits, PIB entries, state reports) when the
 * `schemes` table is empty. Existing data is never overwritten.
 */

function findSqlFile(name: string): string | null {
  const dirs = [
    process.env.DB_SQL_DIR,
    path.resolve(process.cwd(), "lib/db"),
    path.resolve(process.cwd(), "../../lib/db"),
    path.resolve(process.cwd(), "../lib/db"),
  ].filter((d): d is string => Boolean(d));

  for (const dir of dirs) {
    const file = path.join(dir, name);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function readSql(name: string): string {
  const file = findSqlFile(name);
  if (!file) {
    throw new Error(
      `Could not find ${name}. Set DB_SQL_DIR to the folder that contains it (lib/db).`,
    );
  }
  return fs.readFileSync(file, "utf8");
}

/** Drop psql-only meta commands (\restrict, \unrestrict ...) that node-postgres cannot run. */
function stripPsqlMeta(sql: string): string {
  return sql
    .split("\n")
    .filter((line) => !line.startsWith("\\"))
    .join("\n");
}

export async function ensureDatabase(): Promise<void> {
  if (process.env.AUTO_SETUP_DB !== "true") return;

  const client = await pool.connect();
  try {
    const { rows } = await client.query<{ reg: string | null }>(
      "SELECT to_regclass('public.schemes') AS reg",
    );

    if (!rows[0]?.reg) {
      logger.info("Creating database tables");
      await client.query(readSql("schema.sql"));
    }

    const { rows: counts } = await client.query<{ n: string }>(
      "SELECT count(*)::text AS n FROM public.schemes",
    );

    if (Number(counts[0]?.n ?? 0) === 0) {
      logger.info("Loading reference data");
      await client.query("BEGIN");
      try {
        await client.query(stripPsqlMeta(readSql("seed.sql")));
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
      // seed.sql clears the search path for its own statements; restore it.
      await client.query("SELECT set_config('search_path', '\"$user\", public', false)");
      logger.info("Reference data loaded");
    }
  } finally {
    client.release();
  }
}
