/**
 * Proofs Module Tests
 *
 * TDD approach: Tests for Proof Packet generation and export
 */

import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { db, schema } from "../db";
import app from "../index";

const TEST_WORKSPACE_ID = crypto.randomUUID();
const TEST_TASK_ID = "10001";
const TEST_TASK_KEY = "TRAIL-123";
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";

describe("Proofs API", () => {
    const originalFetch = global.fetch;
    let proofId: string;

    // Global setup for mocks
    beforeAll(() => {
        const mockResponse = {
            id: "chatcmpl-mock-456",
            object: "chat.completion",
            created: Date.now(),
            model: "mistralai/devstral-2512:free",
            choices: [{ index: 0, message: { role: "assistant", content: "AI Generated Summary" }, finish_reason: "stop" }],
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                headers: new Headers({ "content-type": "application/json" }),
                json: async () => mockResponse,
                text: async () => JSON.stringify(mockResponse),
            } as Response),
        ) as unknown as typeof global.fetch;
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    // Setup for EVERY test (since state is reset in vitest.setup.ts beforeEach)
    beforeEach(async () => {
        await db.insert(schema.workspaces).values({
            id: TEST_WORKSPACE_ID,
            name: "Test Workspace",
        });
        await db.insert(schema.workspaceMembers).values({
            workspaceId: TEST_WORKSPACE_ID,
            userId: MOCK_USER_ID,
            role: "owner",
        });

        // Insert a default proof packet for GET/POST tests
        const [packet] = await db.insert(schema.proofPackets).values({
            workspaceId: TEST_WORKSPACE_ID,
            taskId: TEST_TASK_ID,
            status: "draft",
        }).returning();

        proofId = packet.id;
    });

    // ============================================
    // Create Proof Packet
    // ============================================
    describe("POST /proofs", () => {
        it("should create a new proof packet", async () => {
            const res = await app.request("/proofs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: TEST_WORKSPACE_ID,
                    taskId: "NEW-TASK-123",
                    taskKey: "NEW-TASK",
                    taskSummary: "New feature",
                }),
            });
            expect(res.status).toBe(201);
            const json = await res.json();
            expect(json.id).toBeDefined();
            expect(json.status).toBe("draft");
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
