import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set (see .env.example)");
}

const url = process.env.DATABASE_URL;
const wantsSsl =
  process.env.DATABASE_SSL === "true" ||
  (process.env.DATABASE_SSL !== "false" && /supabase\.(co|com)/i.test(url));

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: wantsSsl ? { url, ssl: "require" } : { url },
});
