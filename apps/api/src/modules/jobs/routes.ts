/**
 * Cron Jobs Endpoint - Hybrid Architecture
 *
 * Triggered by Supabase pg_cron every 15 minutes.
 * Wakes up Render container and triggers pg-boss to process pending jobs.
 */

import { Hono } from "hono";
import * as jobQueue from "../../lib/job-queue";

const app = new Hono();

/**
 * Verify cron token for security
 */
function verifyCronToken(token: string | undefined): boolean {
    const expectedToken = process.env.CRON_TOKEN;
    if (!expectedToken) {
        console.error("CRON_TOKEN not configured");
        return false;
    }
    return token === expectedToken;
}

/**
 * Process pending closure jobs
 * Called by Supabase pg_cron every 15 minutes
 *
 * Flow:
 * 1. pg_cron calls this endpoint
 * 2. Wakes up Render (if sleeping)
 * 3. pg-boss fetches jobs due for processing
 * 4. Processes each job
 * 5. Render can sleep again after idle
 */
app.all("/process", async (c) => {
    // Verify token (Header OR Query Param)
    const token = c.req.header("X-Cron-Token") || c.req.query("token");

    if (!verifyCronToken(token)) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    console.log("🕐 Cron triggered: Processing pending jobs via pg-boss");

    try {
        // Let pg-boss process pending jobs
        const result = await jobQueue.processPendingJobs();

        return c.json({
            success: true,
            ...result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ Failed to process jobs:", error);
        return c.json(
            {
                error: "Internal server error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            500,
        );
    }
});

/**
 * Health check for cron job
 */
app.get("/health", (c) => {
    return c.json({
        status: "ok",
        service: "cron-jobs (pg-boss hybrid)",
        cronToken: process.env.CRON_TOKEN ? "configured" : "missing",
    });
});

export default app;
