/**
 * Hash Chain Tests
 *
 * TDD approach: Tests for tamper-evident event logging
 */

import { describe, expect, it } from "bun:test";
import { computeEventHash, verifyChainIntegrity } from "../lib/hash-chain";

describe("Hash Chain", () => {
    // ============================================
    // Compute Event Hash
    // ============================================
    describe("computeEventHash", () => {
        it("should compute SHA-256 hash for event", async () => {
            const event = {
                eventType: "handshake",
                triggerSource: "jira_webhook",
                payload: { issueKey: "TRAIL-123" },
                workspaceId: "workspace-1",
                taskId: "TRAIL-123",
                createdAt: new Date("2026-01-17T00:00:00Z"),
            };

            const hash = await computeEventHash(event, null);

            expect(hash).toBeDefined();
            expect(hash.length).toBe(64); // SHA-256 hex = 64 chars
            expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
        });

        it("should produce different hash with different prevHash", async () => {
            const event = {
                eventType: "handshake",
                triggerSource: "jira_webhook",
                payload: { issueKey: "TRAIL-123" },
                workspaceId: "workspace-1",
                createdAt: new Date("2026-01-17T00:00:00Z"),
            };

            const hash1 = await computeEventHash(event, null);
            const hash2 = await computeEventHash(event, "previous-hash-abc");

            expect(hash1).not.toBe(hash2);
        });

        it("should produce same hash for identical input", async () => {
            const event = {
                eventType: "pr_merged",
                triggerSource: "github_webhook",
                payload: { prNumber: 42 },
                workspaceId: "workspace-1",
                createdAt: "2026-01-17T12:00:00.000Z",
            };

            const hash1 = await computeEventHash(event, "prev-hash");
            const hash2 = await computeEventHash(event, "prev-hash");

            expect(hash1).toBe(hash2);
        });
    });

    // ============================================
    // Verify Chain Integrity
    // ============================================
    describe("verifyChainIntegrity", () => {
        it("should return valid for empty chain", async () => {
            const result = await verifyChainIntegrity([]);

            expect(result.valid).toBe(true);
            expect(result.verifiedCount).toBe(0);
            expect(result.errors).toHaveLength(0);
        });

        it("should validate a properly linked chain", async () => {
            // Build a valid chain
            const event1Hash = await computeEventHash(
                {
                    eventType: "handshake",
                    triggerSource: "jira_webhook",
                    payload: {},
                    workspaceId: "ws-1",
                    createdAt: new Date("2026-01-17T00:00:00Z"),
                },
                null,
            );

            const event2Hash = await computeEventHash(
                {
                    eventType: "pr_opened",
                    triggerSource: "github_webhook",
                    payload: {},
                    workspaceId: "ws-1",
                    createdAt: new Date("2026-01-17T01:00:00Z"),
                },
                event1Hash,
            );

            const events = [
                {
                    id: "event-1",
                    prevHash: null,
                    eventHash: event1Hash,
                    eventType: "handshake" as const,
                    triggerSource: "jira_webhook" as const,
                    payload: {},
                    workspaceId: "ws-1",
                    taskId: null,
                    proofPacketId: null,
                    createdAt: new Date("2026-01-17T00:00:00Z"),
                },
                {
                    id: "event-2",
                    prevHash: event1Hash,
                    eventHash: event2Hash,
                    eventType: "pr_opened" as const,
                    triggerSource: "github_webhook" as const,
                    payload: {},
                    workspaceId: "ws-1",
                    taskId: null,
                    proofPacketId: null,
                    createdAt: new Date("2026-01-17T01:00:00Z"),
                },
            ];

            const result = await verifyChainIntegrity(events);

            expect(result.valid).toBe(true);
            expect(result.verifiedCount).toBe(2);
            expect(result.errors).toHaveLength(0);
        });

        it("should detect broken link in chain", async () => {
            const events = [
                {
                    id: "event-1",
                    prevHash: null,
                    eventHash: "hash-1",
                    eventType: "handshake" as const,
                    triggerSource: "jira_webhook" as const,
                    payload: {},
                    workspaceId: "ws-1",
                    taskId: null,
                    proofPacketId: null,
                    createdAt: new Date("2026-01-17T00:00:00Z"),
                },
                {
                    id: "event-2",
                    prevHash: "wrong-prev-hash", // Should be "hash-1"
                    eventHash: "hash-2",
                    eventType: "pr_opened" as const,
                    triggerSource: "github_webhook" as const,
                    payload: {},
                    workspaceId: "ws-1",
                    taskId: null,
                    proofPacketId: null,
                    createdAt: new Date("2026-01-17T01:00:00Z"),
                },
            ];

            const result = await verifyChainIntegrity(events);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some((e) => e.type === "broken_link")).toBe(true);
        });
    });
});
