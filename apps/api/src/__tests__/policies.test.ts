/**
 * Policies Module Tests
 *
 * TDD approach: Tests for closure policies and Optimistic Closure Engine
 */

import { describe, expect, it } from "bun:test";
import app from "../index";

describe("Policies API", () => {
    // ============================================
    // List Policies
    // ============================================
    describe("GET /policies", () => {
        it("should return list of policies", async () => {
            const res = await app.request("/policies");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.policies).toBeDefined();
            expect(Array.isArray(json.policies)).toBe(true);
            expect(json.policies.length).toBeGreaterThan(0);
        });

        it("should include 3 tier presets", async () => {
            const res = await app.request("/policies");
            const json = await res.json();

            const tiers = json.policies.map((p: { tier: string }) => p.tier);
            expect(tiers).toContain("agile");
            expect(tiers).toContain("standard");
            expect(tiers).toContain("hardened");
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
            expect(json.presets.standard).toBeDefined();
            expect(json.presets.hardened).toBeDefined();
        });

        it("should have correct preset values", async () => {
            const res = await app.request("/policies/presets");
            const json = await res.json();

            // Agile: 1 approval, 24h
            expect(json.presets.agile.requiredApprovals).toBe(1);
            expect(json.presets.agile.autoCloseDelayHours).toBe(24);

            // Standard: 2 approvals, 48h
            expect(json.presets.standard.requiredApprovals).toBe(2);
            expect(json.presets.standard.autoCloseDelayHours).toBe(48);

            // Hardened: 3 approvals, 72h
            expect(json.presets.hardened.requiredApprovals).toBe(3);
            expect(json.presets.hardened.autoCloseDelayHours).toBe(72);
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
            expect(json.requiredApprovals).toBe(1);
        });

        it("should return 404 for non-existent policy", async () => {
            const res = await app.request("/policies/non-existent");
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
                    workspaceId: "test-workspace",
                    name: "Custom Policy",
                    tier: "agile",
                }),
            });
            expect(res.status).toBe(201);

            const json = await res.json();
            expect(json.id).toBeDefined();
            expect(json.name).toBe("Custom Policy");
            expect(json.tier).toBe("agile");
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
                    workspaceId: "test-workspace",
                }),
            });
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.eligible).toBeDefined();
            expect(json.policyId).toBeDefined();
            expect(json.policyName).toBeDefined();
            expect(json.checks).toBeDefined();
            expect(json.checks.prMerged).toBeDefined();
            expect(json.checks.ciPassed).toBeDefined();
            expect(json.checks.approvalsCount).toBeDefined();
        });

        it("should return ineligible when requirements not met", async () => {
            const res = await app.request("/policies/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId: "TRAIL-456",
                    workspaceId: "test-workspace",
                }),
            });
            const json = await res.json();

            expect(json.eligible).toBe(false);
            expect(json.reason).toBeDefined();
        });
    });
});
