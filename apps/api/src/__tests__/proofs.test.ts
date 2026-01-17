/**
 * Proofs Module Tests
 *
 * TDD approach: Tests for Proof Packet generation and export
 */

import { describe, expect, it } from "bun:test";
import app from "../index";

describe("Proofs API", () => {
    // ============================================
    // List Proof Packets
    // ============================================
    describe("GET /proofs", () => {
        it("should return paginated proof packets list", async () => {
            const res = await app.request("/proofs");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.packets).toBeDefined();
            expect(Array.isArray(json.packets)).toBe(true);
            expect(json.total).toBeDefined();
            expect(json.page).toBeDefined();
            expect(json.pageSize).toBeDefined();
        });
    });

    // ============================================
    // Get Proof Packet by ID
    // ============================================
    describe("GET /proofs/:id", () => {
        it("should return proof packet by ID", async () => {
            const res = await app.request("/proofs/test-proof-id");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.id).toBe("test-proof-id");
            expect(json.workspaceId).toBeDefined();
            expect(json.status).toBeDefined();
            expect(json.task).toBeDefined();
            expect(json.task.key).toBeDefined();
            expect(json.task.summary).toBeDefined();
        });

        it("should include handshake and execution data", async () => {
            const res = await app.request("/proofs/test-proof-id");
            const json = await res.json();

            expect(json.handshake).toBeDefined();
            expect(json.handshake.triggeredAt).toBeDefined();
            expect(json.handshake.triggerSource).toBeDefined();

            expect(json.execution).toBeDefined();
            expect(json.execution.approvals).toBeDefined();
            expect(json.execution.ciPassed).toBeDefined();
        });
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
                    workspaceId: "test-workspace",
                    taskId: "10001",
                    taskKey: "TRAIL-123",
                    taskSummary: "Test feature implementation",
                }),
            });
            expect(res.status).toBe(201);

            const json = await res.json();
            expect(json.id).toBeDefined();
            expect(json.workspaceId).toBe("test-workspace");
            expect(json.status).toBe("draft");
            expect(json.task.key).toBe("TRAIL-123");
        });
    });

    // ============================================
    // Generate AI Summary
    // ============================================
    describe("POST /proofs/:id/summarize", () => {
        it("should generate AI summary for proof packet", async () => {
            const res = await app.request("/proofs/test-proof-id/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.success).toBe(true);
            expect(json.summary).toBeDefined();
            expect(json.summary.length).toBeGreaterThan(0);
            expect(json.model).toBeDefined();
        });
    });

    // ============================================
    // Export as PDF
    // ============================================
    describe("GET /proofs/:id/pdf", () => {
        it("should return PDF export URL", async () => {
            const res = await app.request("/proofs/test-proof-id/pdf");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.success).toBe(true);
            expect(json.url).toBeDefined();
            expect(json.expiresAt).toBeDefined();
        });
    });

    // ============================================
    // Export as JSON
    // ============================================
    describe("GET /proofs/:id/json", () => {
        it("should return JSON export", async () => {
            const res = await app.request("/proofs/test-proof-id/json");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.id).toBeDefined();
            expect(json.task).toBeDefined();
            expect(json.status).toBeDefined();
        });
    });

    // ============================================
    // Share Proof Packet
    // ============================================
    describe("POST /proofs/:id/share", () => {
        it("should generate shareable link", async () => {
            const res = await app.request("/proofs/test-proof-id/share", {
                method: "POST",
            });
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.success).toBe(true);
            expect(json.shareUrl).toBeDefined();
            expect(json.shareUrl).toContain("https://");
            expect(json.expiresAt).toBeDefined();
        });
    });
});
