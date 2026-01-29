/**
 * Job Queue (pg-boss) - Hybrid Architecture
 *
 * Handles scheduled tasks for the Optimistic Closure Engine.
 * Jobs persist in database even when container sleeps.
 * Triggered by Supabase pg_cron calling /jobs/process endpoint.
 */

import { PgBoss } from "pg-boss";
import { env } from "../env";
import { policiesService } from "../services";

const connectionString = env.DATABASE_URL;

// Singleton instance
let boss: PgBoss | null = null;

export const QUEUE_NAMES = {
    CHECK_CLOSURE: "check_closure_eligibility",
};

/**
 * Initialize pg-boss (does not start worker loop)
 */
async function initializeBoss(): Promise<PgBoss> {
    if (boss) return boss;
    if (!connectionString) {
        throw new Error("DATABASE_URL is required for job queue initialization");
    }

    console.log("Initializing pg-boss job queue...");

    boss = new PgBoss({ connectionString });

    boss.on("error", (error: Error) => console.error("Job Queue Error:", error));

    await boss.start();

    console.log("✅ pg-boss initialized (trigger mode)");
    return boss;
}

export const startJobQueue = initializeBoss;

/**
 * Get boss instance
 */
export async function getBoss(): Promise<PgBoss> {
    if (!boss) {
        boss = await initializeBoss();
    }
    if (!boss) {
        throw new Error("Failed to initialize job queue");
    }
    return boss;
}

/**
 * Schedule a closure eligibility check job
 * Job persists in database even when container sleeps
 */
export async function scheduleClosureCheck(
    workspaceId: string,
    taskId: string,
    delayHours = 24,
): Promise<string> {
    const bossInstance = await getBoss();
    const jobId = await bossInstance.send(
        QUEUE_NAMES.CHECK_CLOSURE,
        { workspaceId, taskId },
        { startAfter: delayHours * 3600, retentionSeconds: 60 * 60 * 24 * 7 }, // Keep details for 7 days
    );

    console.log(`✅ Scheduled closure check: job=${jobId}, task=${taskId}, delay=${delayHours}h`);
    return jobId || "";
}

/**
 * Cancel a scheduled closure job (for veto)
 */
export async function cancelClosureJob(jobId: string): Promise<boolean> {
    const bossInstance = await getBoss();
    // pg-boss v9+ requires queue name for cancellation by ID
    const cancelled = await bossInstance.cancel(QUEUE_NAMES.CHECK_CLOSURE, jobId);
    console.log(
        `${cancelled ? "✅" : "⚠️"} Cancelled closure job ${jobId}: ${cancelled ? "success" : "not found"}`,
    );
    // cancelled is usually void or specific response in newer versions, assuming explicit boolean return intended
    return !!cancelled;
}

/**
 * Process pending closure jobs
 * Called by pg_cron via /jobs/process endpoint
 */
export async function processPendingJobs(): Promise<{
    processed: number;
    failed: number;
}> {
    const bossInstance = await getBoss();

    console.log("🔍 Processing pending closure jobs...");

    // Fetch all jobs that are ready to run
    const jobs = await bossInstance.fetch(QUEUE_NAMES.CHECK_CLOSURE, { batchSize: 10 });

    if (!jobs || jobs.length === 0) {
        console.log("✅ No pending jobs to process");
        return { processed: 0, failed: 0 };
    }

    let processed = 0;
    let failed = 0;

    for (const job of jobs) {
        try {
            const { taskId, workspaceId } = job.data as {
                taskId: string;
                workspaceId: string;
            };

            console.log(`📋 Processing closure for task ${taskId}`);

            // Evaluate and finalize the closure
            await policiesService.evaluateAndFinalize(taskId, workspaceId);

            // Mark job as complete
            await bossInstance.complete(QUEUE_NAMES.CHECK_CLOSURE, job.id);

            processed++;
            console.log(`✅ Completed closure for task ${taskId}`);
        } catch (error) {
            console.error(`❌ Failed to process job ${job.id}:`, error);

            // Mark as failed (pg-boss will retry automatically)
            await bossInstance.fail(
                QUEUE_NAMES.CHECK_CLOSURE,
                job.id,
                error instanceof Error ? error : new Error(String(error)),
            );

            failed++;
        }
    }

    console.log(`✅ Processed ${processed} jobs, ${failed} failed`);
    return { processed, failed };
}

/**
 * Stop the job queue gracefully
 */
export async function stopJobQueue(): Promise<void> {
    if (boss) {
        await boss.stop();
        boss = null;
    }
}
