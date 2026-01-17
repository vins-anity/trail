/**
 * Events Module Tests
 *
 * TDD approach: Tests for hash-chained event log endpoints
 */

import { describe, expect, it } from "bun:test";
import app from "../index";

describe("Events API", () => {
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
            expect(json.page).toBeDefined();
            expect(json.pageSize).toBeDefined();
            expect(json.hasMore).toBeDefined();
        });

        it("should accept query parameters", async () => {
            const res = await app.request("/events?workspaceId=test&page=1&pageSize=10");
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
        it("should return event by ID", async () => {
            const res = await app.request("/events/test-event-id");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.id).toBe("test-event-id");
            expect(json.eventType).toBeDefined();
            expect(json.eventHash).toBeDefined();
        });
    });

    // ============================================
    // Verify Chain Integrity
    // ============================================
    describe("GET /events/verify/:workspaceId", () => {
        it("should return chain verification result", async () => {
            const res = await app.request("/events/verify/test-workspace");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.valid).toBeDefined();
            expect(json.verifiedCount).toBeDefined();
            expect(json.errors).toBeDefined();
            expect(Array.isArray(json.errors)).toBe(true);
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
            expect(Array.isArray(json.events)).toBe(true);
            expect(json.summary).toBeDefined();
            expect(json.summary.prCount).toBeDefined();
            expect(json.summary.approvalCount).toBeDefined();
            expect(json.summary.ciPassed).toBeDefined();
        });
    });
});
