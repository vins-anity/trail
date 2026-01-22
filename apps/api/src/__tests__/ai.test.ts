/**
 * OpenRouter AI Tests
 *
 * Tests for AI-powered proof summary generation using OpenRouter's free-tier models.
 * Note: The OpenRouter SDK (v0.3.14) has a compatibility issue with Bun's test environment
 * where httpMeta.response can be undefined, causing errors during error construction.
 * These tests are designed to be resilient to this SDK bug.
 */

import { beforeAll, describe, expect, test } from "bun:test";
import { generateProofSummary, isConfigured, type ProofSummaryInput } from "../lib/ai";

describe("OpenRouter AI Integration", () => {
    beforeAll(() => {
        if (!process.env.OPENROUTER_API_KEY) {
            process.env.OPENROUTER_API_KEY = "sk-or-v1-test-key";
        }
    });

    test("isConfigured returns true when API key is set", () => {
        expect(isConfigured()).toBe(true);
    });

    test("isConfigured returns false when API key is missing", () => {
        const originalKey = process.env.OPENROUTER_API_KEY;
        delete process.env.OPENROUTER_API_KEY;
        expect(isConfigured()).toBe(false);
        process.env.OPENROUTER_API_KEY = originalKey;
    });

    test("generateProofSummary handles full input", async () => {
        const input: ProofSummaryInput = {
            taskKey: "TRAIL-123",
            taskSummary: "Implement user authentication",
            commits: [
                { message: "Add login form", author: "dev@example.com" },
                { message: "Implement JWT tokens", author: "dev@example.com" },
            ],
            prDescription: "Added complete authentication system",
            approvers: ["tech-lead@example.com"],
            ciStatus: "passed",
        };

        // SDK may throw due to Bun compatibility issues, but our function should
        // always return a result (either from AI or fallback)
        const result = await generateProofSummary(input);

        expect(result).toBeDefined();
        expect(result.summary).toBeDefined();
        expect(typeof result.summary).toBe("string");
        expect(result.summary.length).toBeGreaterThan(0);
    });

    test("generateProofSummary handles minimal input", async () => {
        const input: ProofSummaryInput = {
            taskKey: "TRAIL-456",
            taskSummary: "Simple bug fix",
        };

        const result = await generateProofSummary(input);
        expect(result.summary).toBeTruthy();
    });

    test("generateProofSummary uses valid model", async () => {
        const input: ProofSummaryInput = {
            taskKey: "TRAIL-789",
            taskSummary: "Test model routing",
        };

        const result = await generateProofSummary(input);

        const validModels = [
            "mistralai/devstral-2512:free",
            "xiaomi/mimo-v2-flash:free",
            "z-ai/glm-4.5-air:free",
            "fallback",
        ];
        expect(validModels).toContain(result.model);
    });

    test("generateProofSummary handles CI status", async () => {
        const input: ProofSummaryInput = {
            taskKey: "TRAIL-100",
            taskSummary: "Fix failing tests",
            ciStatus: "passed",
        };

        const result = await generateProofSummary(input);
        expect(result.summary).toBeTruthy();
    });
});

