/**
 * Events Module Tests
 *
 * TDD approach: Tests for hash-chained event log endpoints
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import app from "../index";

const TEST_WORKSPACE_ID = crypto.randomUUID();

describe("Events API", () => {
    // Setup: Create a test workspace
    beforeAll(async () => {
        await db.insert(schema.workspaces).values({
            id: TEST_WORKSPACE_ID,
            name: "Test Workspace Events",
        });
    });

    // Cleanup
    afterAll(async () => {
        await db.delete(schema.workspaces).where(eq(schema.workspaces.id, TEST_WORKSPACE_ID));
    });

    // ============================================
    // List Events
    // ============================================
    describe("GET /events", () => {
        it("should return paginated events list", async () => {
            const res = await app.request("/events");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.events).toBeDefined();
            expect(Array.isArray(json.events)).toBe(true);
            expect(json.total).toBeDefined();
        });

        it("should accept query parameters", async () => {
            const res = await app.request(
                `/events?workspaceId=${TEST_WORKSPACE_ID}&page=1&pageSize=10`,
            );
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.page).toBe(1);
            expect(json.pageSize).toBe(10);
        });
    });

    // ============================================
    // Get Single Event
    // ============================================
    describe("GET /events/:id", () => {
        it("should return 404 for non-existent event", async () => {
            const randomId = crypto.randomUUID();
            const res = await app.request(`/events/${randomId}`);
            expect(res.status).toBe(404);
        });
    });

    // ============================================
    // Verify Chain Integrity
    // ============================================
    describe("GET /events/verify/:workspaceId", () => {
        it("should return chain verification result", async () => {
            const res = await app.request(`/events/verify/${TEST_WORKSPACE_ID}`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.valid).toBe(true); // Should be valid logic (empty or just created)
            expect(json.verifiedCount).toBeDefined();
        });
    });

    // ============================================
    // Get Events for Task
    // ============================================
    describe("GET /events/task/:taskId", () => {
        it("should return events for a task with summary", async () => {
            const res = await app.request("/events/task/TRAIL-123");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.taskId).toBe("TRAIL-123");
            expect(json.events).toBeDefined();
            expect(json.summary).toBeDefined();
        });
    });

    // ============================================
    // Dashboard Stats
    // ============================================
    describe("GET /stats", () => {
        it("should return dashboard statistics", async () => {
            const res = await app.request("/stats");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.activeTasks).toBeDefined();
            expect(typeof json.activeTasks).toBe("number");
        });

        it("should return stats filtered by workspace", async () => {
            const res = await app.request(`/stats?workspaceId=${TEST_WORKSPACE_ID}`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.activeTasks).toBeDefined();
            expect(json.activeTasks).toBeGreaterThanOrEqual(0);
        });

        it("should return zero active tasks for empty workspace", async () => {
            // New workspace with no events should have 0 active tasks
            const res = await app.request(`/stats?workspaceId=${TEST_WORKSPACE_ID}`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.activeTasks).toBe(0);
        });
    });
});
