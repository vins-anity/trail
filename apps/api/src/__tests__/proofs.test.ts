/**
 * Proofs Module Tests
 *
 * TDD approach: Tests for Proof Packet generation and export
 */

import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import app from "../index";

const TEST_WORKSPACE_ID = crypto.randomUUID();
const TEST_TASK_ID = "10001";
const TEST_TASK_KEY = "TRAIL-123";

describe("Proofs API", () => {
    const originalFetch = global.fetch;

    // Setup: Create a test workspace and mock AI
    beforeAll(async () => {
        // Mock AI response
        global.fetch = mock(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({ "content-type": "application/json" }),
                json: async () => ({
                    choices: [
                        {
                            message: {
                                content: "AI Generated Summary",
                            },
                        },
                    ],
                }),
                text: async () => JSON.stringify({
                    choices: [
                        {
                            message: {
                                content: "AI Generated Summary",
                            },
                        },
                    ],
                }),
            } as Response)
        );

        await db.insert(schema.workspaces).values({
            id: TEST_WORKSPACE_ID,
            name: "Test Workspace",
        });
    });

    // Cleanup: Delete test workspace (cascades to proof packets)
    afterAll(async () => {
        global.fetch = originalFetch;
        await db.delete(schema.workspaces).where(eq(schema.workspaces.id, TEST_WORKSPACE_ID));
    });

    let proofId: string;

    // ============================================
    // Create Proof Packet (First, to get an ID)
    // ============================================
    describe("POST /proofs", () => {
        it("should create a new proof packet", async () => {
            const res = await app.request("/proofs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: TEST_WORKSPACE_ID,
                    taskId: TEST_TASK_ID,
                    taskKey: TEST_TASK_KEY,
                    taskSummary: "Test feature implementation",
                }),
            });
            expect(res.status).toBe(201);

            const json = await res.json();
            expect(json.id).toBeDefined();
            expect(json.workspaceId).toBe(TEST_WORKSPACE_ID);
            expect(json.status).toBe("draft");
            expect(json.task.key).toBe(TEST_TASK_KEY);

            proofId = json.id;
        });
    });

    // ============================================
    // List Proof Packets
    // ============================================
    describe("GET /proofs", () => {
        it("should return paginated proof packets list", async () => {
            const res = await app.request(`/proofs?workspaceId=${TEST_WORKSPACE_ID}`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.packets).toBeDefined();
            expect(Array.isArray(json.packets)).toBe(true);
            expect(json.packets.length).toBeGreaterThan(0);
        });
    });

    // ============================================
    // Get Proof Packet by ID
    // ============================================
    describe("GET /proofs/:id", () => {
        it("should return proof packet by ID", async () => {
            const res = await app.request(`/proofs/${proofId}`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.id).toBe(proofId);
            expect(json.workspaceId).toBe(TEST_WORKSPACE_ID);
            expect(json.task).toBeDefined();
        });

        it("should return 404 for non-existent proof packet", async () => {
            const randomId = crypto.randomUUID();
            const res = await app.request(`/proofs/${randomId}`);
            expect(res.status).toBe(404);
        });
    });

    // ============================================
    // Generate AI Summary
    // ============================================
    describe("POST /proofs/:id/summarize", () => {
        it("should generate AI summary for proof packet", async () => {
            const res = await app.request(`/proofs/${proofId}/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.success).toBe(true);
            expect(json.summary).toBeDefined();
        });
    });

    // ============================================
    // Export as PDF
    // ============================================
    describe("GET /proofs/:id/pdf", () => {
        it("should return PDF export URL", async () => {
            const res = await app.request(`/proofs/${proofId}/pdf`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.success).toBe(true);
            expect(json.url).toBeDefined();
        });
    });

    // ============================================
    // Export as JSON
    // ============================================
    describe("GET /proofs/:id/json", () => {
        it("should return JSON export", async () => {
            const res = await app.request(`/proofs/${proofId}/json`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.id).toBe(proofId);
        });
    });

    // ============================================
    // Share Proof Packet
    // ============================================
    describe("POST /proofs/:id/share", () => {
        it("should generate shareable link", async () => {
            const res = await app.request(`/proofs/${proofId}/share`, {
                method: "POST",
            });
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.success).toBe(true);
            expect(json.shareUrl).toBeDefined();
        });
    });
});
