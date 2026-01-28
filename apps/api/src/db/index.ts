/**
 * Database Connection
 *
 * This file sets up the connection to your PostgreSQL database using Drizzle ORM.
 * It works with any PostgreSQL database including:
 * - Supabase
 * - Neon
 * - Local PostgreSQL
 * - Any PostgreSQL-compatible database
 *
 * Configuration:
 * Set DATABASE_URL in your .env file. Examples:
 *
 * Local:
 *   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trail
 *
 * Supabase:
 *   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
 *
 * @see https://orm.drizzle.team/docs/get-started-postgresql
 */

import { env } from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// ============================================
// Database Client Setup
// ============================================

let connectionString = env.DATABASE_URL;

// Log which connection mode we're using
if (connectionString?.includes(":6543")) {
    console.log("📡 Using Supabase Transaction Pooler (port 6543). Prepared statements disabled.");
} else if (connectionString?.includes(":5432")) {
    console.log("📡 Using Direct Connection (port 5432). Prepared statements enabled.");
}

if (!connectionString) {
    console.error(`
╔══════════════════════════════════════════════════════════════╗
║  ❌ DATABASE_URL is not set!                                   ║
║                                                                ║
║  Please create a .env file in the root directory with:        ║
║                                                                ║
║  DATABASE_URL=postgresql://user:pass@host:5432/database       ║
║                                                                ║
║  For Supabase, find this in:                                  ║
║  Dashboard → Settings → Database → Connection string          ║
╚══════════════════════════════════════════════════════════════╝
	`);
}
// Don't exit in dev - allow app to start for other purposes
// process.exit(1);


// ============================================
// Database Client Setup
// ============================================

/**
 * Create postgres.js client.
 *
 * postgres.js is a fast, pure JavaScript PostgreSQL client.
 * It handles connection pooling automatically.
 *
 * Options:
 * - max: Maximum number of connections (default: 10)
 * - idle_timeout: Close idle connections after X seconds
 * - connect_timeout: Timeout for new connections
 *
 * For Supabase, we use their connection string directly.
 * Pooling is handled by Supabase's built-in pgbouncer.
 * @see https://supabase.com/docs/guides/database/drizzle
 */
const client = postgres(connectionString || "", {
    // Connection pool settings
    max: 10,

    // Supabase requires SSL in production
    ssl: connectionString?.includes("supabase.co") || connectionString?.includes("supabase.com") ? "require" : false,

    // Helpful for debugging
    debug: process.env.NODE_ENV === "development" ? console.log : undefined,

    // Prepare statements:
    // - Use FALSE for Transaction Pooler (6543)
    // - Use TRUE (default) for Direct/Session (5432)
    prepare: !connectionString?.includes(":6543"),
});

/**
 * Drizzle ORM instance.
 *
 * Use this to query your database with type safety:
 *
 * @example
 * // Select all todos
 * const todos = await db.select().from(schema.todos);
 *
 * // Insert a new todo
 * await db.insert(schema.todos).values({ title: "My todo" });
 *
 * // Update with a where clause
 * await db.update(schema.todos)
 *   .set({ completed: true })
 *   .where(eq(schema.todos.id, 1));
 *
 * @see https://orm.drizzle.team/docs/overview
 */
export const db = drizzle(client, { schema });

// ============================================
// Exports
// ============================================

// Export schema for use in other files
export { schema };

// Export the raw client if needed for advanced use cases
export { client as pgClient };
