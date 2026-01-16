/**
 * Drizzle Kit Configuration
 *
 * This file configures how Drizzle Kit manages your database schema:
 * - Generate migrations from schema changes
 * - Push schema directly to database (dev mode)
 * - Open Drizzle Studio for database GUI
 *
 * Commands:
 *   bun run db:generate  - Generate migration files from schema
 *   bun run db:migrate   - Apply migrations to database
 *   bun run db:push      - Push schema directly (dev only)
 *   bun run db:studio    - Open Drizzle Studio GUI
 *
 * @see https://orm.drizzle.team/kit-docs/overview
 */

import { defineConfig } from "drizzle-kit";

/**
 * Get database URL from environment.
 * Falls back to local PostgreSQL for development.
 */
const databaseUrl =
    process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/honolulu";

export default defineConfig({
    // Path to your schema file(s)
    schema: "./src/db/schema.ts",

    // Output directory for migration files
    out: "./drizzle",

    // Database dialect (PostgreSQL for Supabase)
    dialect: "postgresql",

    // Connection credentials
    dbCredentials: {
        url: databaseUrl,
    },

    // Print SQL statements during operations
    verbose: true,

    // Require confirmation before destructive operations
    strict: true,
});
