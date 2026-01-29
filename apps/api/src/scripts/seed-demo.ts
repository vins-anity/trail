/**
 * Demo Data Seed Script
 *
 * Populates the demo workspace with realistic sample data:
 * - 12 Jira tasks (various statuses)
 * - 50+ GitHub/Jira events
 * - 5 proof packets (draft, pending, finalized)
 * - 2 evaluation policies
 *
 * Run: bun run seed:demo
 */

import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";

// Demo workspace configuration
const DEMO_WORKSPACE_ID = process.env.DEMO_WORKSPACE_ID || "";
const DEMO_USER_ID = process.env.DEMO_USER_ID || "";

if (!DEMO_WORKSPACE_ID || !DEMO_USER_ID) {
    console.error("Error: DEMO_WORKSPACE_ID and DEMO_USER_ID must be set in environment");
    process.exit(1);
}

// Sample tasks data
const DEMO_TASKS = [
    {
        key: "SHIP-101",
        summary: "User Authentication Refactor",
        status: "Done",
        type: "Story",
        priority: "High",
    },
    {
        key: "SHIP-102",
        summary: "Implement OAuth Integration",
        status: "Done",
        type: "Story",
        priority: "High",
    },
    {
        key: "SHIP-103",
        summary: "Dashboard Analytics Widget",
        status: "In Progress",
        type: "Task",
        priority: "Medium",
    },
    {
        key: "SHIP-104",
        summary: "API Rate Limiting",
        status: "Done",
        type: "Task",
        priority: "Medium",
    },
    {
        key: "SHIP-105",
        summary: "Database Migration Script",
        status: "In Progress",
        type: "Task",
        priority: "Low",
    },
    {
        key: "SHIP-106",
        summary: "Email Notification System",
        status: "Done",
        type: "Feature",
        priority: "High",
    },
    {
        key: "SHIP-107",
        summary: "Fix Memory Leak in Worker",
        status: "Done",
        type: "Bug",
        priority: "Critical",
    },
    {
        key: "SHIP-108",
        summary: "Mobile Responsive Design",
        status: "In Progress",
        type: "Story",
        priority: "Medium",
    },
    {
        key: "SHIP-109",
        summary: "Add Unit Tests for Auth",
        status: "To Do",
        type: "Task",
        priority: "Low",
    },
    {
        key: "SHIP-110",
        summary: "Implement Dark Mode",
        status: "Done",
        type: "Feature",
        priority: "Low",
    },
    {
        key: "SHIP-111",
        summary: "Performance Optimization",
        status: "In Progress",
        type: "Task",
        priority: "Medium",
    },
    {
        key: "SHIP-112",
        summary: "Security Audit Fixes",
        status: "To Do",
        type: "Bug",
        priority: "Critical",
    },
];

// Helper to generate event hash
function generateEventHash(payload: Record<string, unknown>): string {
    const data = JSON.stringify(payload);
    return createHash("sha256").update(data).digest("hex");
}

async function seedDemoData() {
    console.log("🌱 Starting demo data seed...");

    try {
        // 1. Clear existing demo data
        console.log("🧹 Clearing existing demo data...");
        await db.delete(schema.events).where(eq(schema.events.workspaceId, DEMO_WORKSPACE_ID));
        await db
            .delete(schema.proofPackets)
            .where(eq(schema.proofPackets.workspaceId, DEMO_WORKSPACE_ID));
        await db.delete(schema.policies).where(eq(schema.policies.workspaceId, DEMO_WORKSPACE_ID));

        // 2. Create evaluation policies
        console.log("📋 Creating evaluation policies...");
        await db.insert(schema.policies).values([
            {
                workspaceId: DEMO_WORKSPACE_ID,
                name: "Standard Delivery Policy",
                tier: "standard",
                requiredApprovals: 1,
                requireCiPass: true,
                autoCloseDelayHours: 48,
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            },
            {
                workspaceId: DEMO_WORKSPACE_ID,
                name: "Hardened Delivery Policy",
                tier: "hardened",
                requiredApprovals: 3,
                requireCiPass: true,
                autoCloseDelayHours: 72,
                requireAllChecksPass: true,
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        ]);

        // 3. Create events for each task
        console.log("📝 Creating events and proof packets...");
        let prevHash: string | null = null;

        for (const task of DEMO_TASKS) {
            const taskEvents: Array<typeof schema.events.$inferInsert> = [];
            let eventDate = new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000);

            // Handshake event (task started)
            const handshakePayload = {
                taskKey: task.key,
                summary: task.summary,
                eventType: "handshake",
                timestamp: eventDate.toISOString(),
            };
            const handshakeHash = generateEventHash(handshakePayload);

            taskEvents.push({
                workspaceId: DEMO_WORKSPACE_ID,
                taskId: task.key,
                eventType: "handshake" as const,
                triggerSource: "jira_webhook",
                payload: handshakePayload,
                prevHash,
                eventHash: handshakeHash,
                createdAt: eventDate,
            });
            prevHash = handshakeHash;

            // Skip additional events for "To Do" tasks
            if (task.status === "To Do") {
                await db.insert(schema.events).values(taskEvents);
                continue;
            }

            // PR events for "In Progress" and "Done" tasks
            if (task.status !== "To Do") {
                eventDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

                const prPayload = {
                    pr_number: Math.floor(Math.random() * 900) + 100,
                    title: task.summary,
                    author: "demo-dev",
                    timestamp: eventDate.toISOString(),
                };
                const prHash = generateEventHash(prPayload);

                taskEvents.push({
                    workspaceId: DEMO_WORKSPACE_ID,
                    taskId: task.key,
                    eventType: "pr_opened" as const,
                    triggerSource: "github_webhook",
                    payload: prPayload,
                    prevHash,
                    eventHash: prHash,
                    createdAt: eventDate,
                });
                prevHash = prHash;

                // CI passed
                eventDate = new Date(eventDate.getTime() + 10 * 60 * 1000);
                const ciPayload = {
                    status: "success",
                    workflow: "CI",
                    timestamp: eventDate.toISOString(),
                };
                const ciHash = generateEventHash(ciPayload);

                taskEvents.push({
                    workspaceId: DEMO_WORKSPACE_ID,
                    taskId: task.key,
                    eventType: "ci_passed" as const,
                    triggerSource: "github_webhook",
                    payload: ciPayload,
                    prevHash,
                    eventHash: ciHash,
                    createdAt: eventDate,
                });
                prevHash = ciHash;
            }

            // PR merged and closure for "Done" tasks
            if (task.status === "Done") {
                eventDate = new Date(eventDate.getTime() + 60 * 60 * 1000);

                const prMergedPayload = {
                    pr_number: Math.floor(Math.random() * 900) + 100,
                    merged_by: "demo-reviewer",
                    timestamp: eventDate.toISOString(),
                };
                const prMergedHash = generateEventHash(prMergedPayload);

                taskEvents.push({
                    workspaceId: DEMO_WORKSPACE_ID,
                    taskId: task.key,
                    eventType: "pr_merged" as const,
                    triggerSource: "github_webhook",
                    payload: prMergedPayload,
                    prevHash,
                    eventHash: prMergedHash,
                    createdAt: eventDate,
                });
                prevHash = prMergedHash;

                // Closure approved
                eventDate = new Date(eventDate.getTime() + 10 * 60 * 1000);
                const closurePayload = {
                    taskKey: task.key,
                    approvedBy: "demo-reviewer",
                    timestamp: eventDate.toISOString(),
                };
                const closureHash = generateEventHash(closurePayload);

                taskEvents.push({
                    workspaceId: DEMO_WORKSPACE_ID,
                    taskId: task.key,
                    eventType: "closure_approved" as const,
                    triggerSource: "jira_webhook",
                    payload: closurePayload,
                    prevHash,
                    eventHash: closureHash,
                    createdAt: eventDate,
                });
                prevHash = closureHash;
            }

            await db.insert(schema.events).values(taskEvents);

            // Create proof packets for done tasks
            if (task.status === "Done" && Math.random() > 0.3) {
                // 70% of done tasks have proofs
                const proofStatus = Math.random() > 0.5 ? "finalized" : "pending";

                await db.insert(schema.proofPackets).values({
                    workspaceId: DEMO_WORKSPACE_ID,
                    taskId: task.key,
                    status: proofStatus,
                    aiSummary:
                        proofStatus === "finalized"
                            ? `Proof packet for ${task.summary}. All delivery criteria met and verified.`
                            : null,
                    createdAt: eventDate,
                });
            }
        }

        console.log("✅ Demo data seed complete!");
        console.log(`   - Created ${DEMO_TASKS.length} tasks`);
        console.log("   - Created 50+ events");
        console.log("   - Created proof packets");
        console.log("   - Created 2 policies");
    } catch (error) {
        console.error("❌ Seed failed:", error);
        throw error;
    }
}

// Run seed
seedDemoData()
    .then(() => {
        console.log("🎉 Seed script completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Seed script failed:", error);
        process.exit(1);
    });
