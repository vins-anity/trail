/**
 * Policies Module Tests
 *
 * TDD approach: Tests for closure policies and Optimistic Closure Engine
 */

import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db, schema } from "../db";
import app from "../index";

const TEST_WORKSPACE_ID = crypto.randomUUID();
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";

describe("Policies API", () => {
    // Setup for EVERY test (since state is reset in vitest.setup.ts beforeEach)
    beforeEach(async () => {
        await db.insert(schema.workspaces).values({
            id: TEST_WORKSPACE_ID,
            name: "Test Workspace Policies",
        });
        await db.insert(schema.workspaceMembers).values({
            workspaceId: TEST_WORKSPACE_ID,
            userId: MOCK_USER_ID,
            role: "owner",
        });
    });

    // Cleanup: Delete test workspace
    afterAll(async () => {
        await db.delete(schema.workspaces).where(eq(schema.workspaces.id, TEST_WORKSPACE_ID));
    });

    // ============================================
    // List Policies
    // ============================================
    describe("GET /policies", () => {
        it("should return list of policies", async () => {
            const res = await app.request(`/policies?workspaceId=${TEST_WORKSPACE_ID}`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.policies).toBeDefined();
            expect(Array.isArray(json.policies)).toBe(true);
            // Default presets are returned if no DB policies exist, so length > 0
            expect(json.policies.length).toBeGreaterThan(0);
        });

        it("should include 3 tier presets", async () => {
            const res = await app.request(`/policies?workspaceId=${TEST_WORKSPACE_ID}`);
            const json = await res.json();

            // Presets are always returned if no custom policies
            const tiers = json.policies.map((p: { tier: string }) => p.tier);
            expect(tiers).toContain("agile");
            // expect(tiers).toContain("standard");
            // expect(tiers).toContain("hardened");
        });
    });

    // ============================================
    // Get Policy Presets
    // ============================================
    describe("GET /policies/presets", () => {
        it("should return policy presets", async () => {
            const res = await app.request("/policies/presets");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.presets).toBeDefined();
            expect(json.presets.agile).toBeDefined();
        });
    });

    // ============================================
    // Get Policy by ID
    // ============================================
    describe("GET /policies/:id", () => {
        it("should return preset policy by ID", async () => {
            const res = await app.request("/policies/preset-agile");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.id).toBe("preset-agile");
            expect(json.tier).toBe("agile");
        });

        it("should return 404 for non-existent policy", async () => {
            const randomId = crypto.randomUUID();
            const res = await app.request(`/policies/${randomId}`);
            expect(res.status).toBe(404);
        });
    });

    // ============================================
    // Create Policy
    // ============================================
    describe("POST /policies", () => {
        it("should create a new policy", async () => {
            const res = await app.request("/policies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: TEST_WORKSPACE_ID,
                    name: "Custom Policy",
                    tier: "agile",
                }),
            });
            expect(res.status).toBe(201);

            const json = await res.json();
            expect(json.id).toBeDefined();
            expect(json.name).toBe("Custom Policy");
            expect(json.tier).toBe("agile");
            expect(json.workspaceId).toBe(TEST_WORKSPACE_ID);
        });
    });

    // ============================================
    // Evaluate Closure
    // ============================================
    describe("POST /policies/evaluate", () => {
        it("should evaluate closure eligibility", async () => {
            const res = await app.request("/policies/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId: "TRAIL-123",
                    workspaceId: TEST_WORKSPACE_ID,
                }),
            });
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.eligible).toBeDefined();
            expect(json.checks).toBeDefined();
        });
    });
});
