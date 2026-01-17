/**
 * Job Queue (pg-boss)
 *
 * Handles scheduled tasks for the Optimistic Closure Engine.
 */

import { PgBoss } from "pg-boss";
import { policiesService } from "../services";

const connectionString = process.env.DATABASE_URL!;

// Singleton instance
let boss: PgBoss | null = null;

export const QUEUE_NAMES = {
    CHECK_CLOSURE: "check_closure_eligibility",
};

/**
 * Initialize and start the job queue
 */
export async function startJobQueue() {
    if (boss) return boss;

    if (!connectionString) {
        throw new Error("DATABASE_URL is required for job queue");
    }

    console.log("Initializing Job Queue (pg-boss)...");

    // @ts-expect-error - PgBoss constructor issue
    boss = new PgBoss(connectionString);

    boss.on("error", (error: Error) => console.error("Job Queue Error:", error));

    await boss.start();

    // Ensure Queue exists
    await boss.createQueue(QUEUE_NAMES.CHECK_CLOSURE);

    // Register Workers
    // biome-ignore lint/suspicious/noExplicitAny: job data is loose
    await boss.work(QUEUE_NAMES.CHECK_CLOSURE, async (job: any) => {
        const { taskId, workspaceId } = job.data as { taskId: string; workspaceId: string };
        console.log(`Processing closure check for task ${taskId}`);

        // Use Policy Service to verify and finalize
        await policiesService.evaluateAndFinalize(taskId, workspaceId);
    });

    console.log("Job Queue started successfully");
    return boss;
}

/**
 * Stop the job queue gracefully
 */
export async function stopJobQueue() {
    if (boss) {
        await boss.stop();
        boss = null;
    }
}

/**
 * Get boss instance (for testing or advanced use)
 */
export async function getBoss() {
    if (!boss) {
        await startJobQueue();
    }
    return boss!;
}

/**
 * Schedule a closure eligibility check job
 */
export async function scheduleClosureCheck(
    workspaceId: string,
    proofPacketId: string,
    delayHours = 24,
) {
    const bossInstance = await getBoss();
    const jobId = await bossInstance.send(
        "check_closure_eligibility",
        { workspaceId, proofPacketId },
        { startAfter: `${delayHours} hours` },
    );
    console.log(
        `Scheduled closure check for proof=${proofPacketId} in ${delayHours}h, jobId=${jobId}`,
    );
    return jobId;
}

/**
 * Cancel a scheduled closure job (for veto)
 */
export async function cancelClosureJob(jobId: string) {
    const bossInstance = await getBoss();
    const cancelled = await bossInstance.cancel(jobId);
    console.log(`Cancelled closure job ${jobId}: ${cancelled ? "success" : "not found"}`);
    return cancelled;
}
