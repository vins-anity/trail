/**
 * Background Worker
 *
 * Runs the pg-boss job queue processor.
 * Usage: bun run src/worker.ts
 */

import { startJobQueue } from "./lib/job-queue";

async function main() {
    console.log("Starting Trail AI Worker...");

    try {
        await startJobQueue();
        console.log("Worker is running. Press Ctrl+C to exit.");

        // Keep process alive
        // pg-boss works by polling, so it has active timers.
        // However, we should handle graceful shutdown.

        const shutdown = async () => {
            console.log("Shutting down worker...");
            // boss.stop() if needed, but process exit cleans up.
            process.exit(0);
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (error) {
        console.error("Failed to start worker:", error);
        process.exit(1);
    }
}

main();
