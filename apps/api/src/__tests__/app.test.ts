/**
 * Trail AI API Tests
 *
 * TDD approach: Tests for the core API endpoints
 */

import { beforeAll, describe, expect, it } from "bun:test";
import app from "../index";

describe("Trail AI API", () => {
    // ============================================
    // Health Check
    // ============================================
    describe("GET /health", () => {
        it("should return status ok", async () => {
            const res = await app.request("/health");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.status).toBe("ok");
        });
    });

    // ============================================
    // Landing Page
    // ============================================
    describe("GET /", () => {
        it("should return HTML landing page", async () => {
            const res = await app.request("/");
            expect(res.status).toBe(200);

            const html = await res.text();
            expect(html).toContain("Trail AI API");
            expect(html).toContain("Delivery Assurance");
        });
    });

    // ============================================
    // OpenAPI Documentation
    // ============================================
    describe("GET /doc", () => {
        it("should return OpenAPI JSON spec", async () => {
            const res = await app.request("/doc");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.openapi).toBeDefined();
            expect(json.info.title).toBe("Trail AI API");
        });
    });

    describe("GET /reference", () => {
        it("should return Scalar API reference page", async () => {
            const res = await app.request("/reference");
            expect(res.status).toBe(200);

            const html = await res.text();
            expect(html).toContain("script");
        });
    });
});
