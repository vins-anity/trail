/**
 * Database Index Migration Script
 *
 * Run this to apply performance indexes manually via Drizzle.
 */

import { sql } from "drizzle-orm";
import { db } from "../db";

async function applyIndexes() {
    console.log("Applying performance indexes...");

    try {
        // Events indexes
        await db.execute(
            sql`CREATE INDEX IF NOT EXISTS idx_events_workspace_task ON events(workspace_id, task_id)`,
        );
        console.log("✓ idx_events_workspace_task");

        await db.execute(
            sql`CREATE INDEX IF NOT EXISTS idx_events_workspace_created ON events(workspace_id, created_at DESC)`,
        );
        console.log("✓ idx_events_workspace_created");

        await db.execute(
            sql`CREATE INDEX IF NOT EXISTS idx_events_type ON events(workspace_id, event_type)`,
        );
        console.log("✓ idx_events_type");

        // Proof packets indexes
        await db.execute(
            sql`CREATE INDEX IF NOT EXISTS idx_proof_packets_workspace_status ON proof_packets(workspace_id, status)`,
        );
        console.log("✓ idx_proof_packets_workspace_status");

        await db.execute(
            sql`CREATE INDEX IF NOT EXISTS idx_proof_packets_task ON proof_packets(workspace_id, task_id)`,
        );
        console.log("✓ idx_proof_packets_task");

        // Closure jobs indexes
        await db.execute(
            sql`CREATE INDEX IF NOT EXISTS idx_closure_jobs_status_scheduled ON closure_jobs(status, scheduled_for)`,
        );
        console.log("✓ idx_closure_jobs_status_scheduled");

        await db.execute(
            sql`CREATE INDEX IF NOT EXISTS idx_closure_jobs_workspace ON closure_jobs(workspace_id, status)`,
        );
        console.log("✓ idx_closure_jobs_workspace");

        // Policies index
        await db.execute(
            sql`CREATE INDEX IF NOT EXISTS idx_policies_workspace ON policies(workspace_id)`,
        );
        console.log("✓ idx_policies_workspace");

        console.log("\n✅ All indexes applied successfully!");
    } catch (error) {
        console.error("❌ Error applying indexes:", error);
        process.exit(1);
    }

    process.exit(0);
}

applyIndexes();
