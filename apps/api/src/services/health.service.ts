import { sql } from "drizzle-orm";
import { db } from "../db";
import { env } from "../env";

export interface HealthStatus {
    status: "ok" | "error" | "warning";
    timestamp: string;
    uptime: number;
    version: string;
    checks: {
        database: {
            status: "ok" | "error";
            message?: string;
            latencyMs?: number;
        };
        jobQueue: {
            status: "ok" | "error" | "warning";
            message?: string;
        };
        environment: {
            status: "ok" | "warning";
            missingOptionalVars: string[];
        };
    };
}

const startTime = Date.now();

export async function getHealthStatus(): Promise<HealthStatus> {
    const dbStart = Date.now();
    let dbStatus: "ok" | "error" = "ok";
    let dbMessage: string | undefined;
    let dbLatency: number | undefined;

    try {
        await db.execute(sql`SELECT 1`);
        dbLatency = Date.now() - dbStart;
    } catch (err) {
        dbStatus = "error";
        dbMessage = err instanceof Error ? err.message : "Unknown database error";
    }

    // Environment check
    const optionalVars = [
        "GEMINI_API_KEY",
        "OPENROUTER_API_KEY",
        "SLACK_BOT_TOKEN",
        "JIRA_API_TOKEN",
        "GITHUB_WEBHOOK_SECRET",
    ];
    const missingOptionalVars = optionalVars.filter((key) => !process.env[key]);

    // Overall status
    const status =
        dbStatus === "error" ? "error" : missingOptionalVars.length > 0 ? "warning" : "ok";

    return {
        status,
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - startTime) / 1000),
        version: "1.0.0", // Hardcoded for now, could be read from package.json
        checks: {
            database: {
                status: dbStatus,
                message: dbMessage,
                latencyMs: dbLatency,
            },
            jobQueue: {
                // In a real app, we would ping pg-boss here.
                // For now, if DB is ok, job queue is likely ok as it shares the same DB.
                status: dbStatus,
                message: dbStatus === "error" ? "Database unreachable" : undefined,
            },
            environment: {
                status: missingOptionalVars.length > 0 ? "warning" : "ok",
                missingOptionalVars,
            },
        },
    };
}
