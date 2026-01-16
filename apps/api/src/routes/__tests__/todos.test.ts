import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "../../db";
import { app } from "../../index";

// Mock the database
vi.mock("../../db", () => ({
    db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: 1, title: "Test", completed: false }]),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
    },
}));

describe("Todos API Routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /todos", () => {
        it("should return an empty array when no todos exist", async () => {
            const res = await app.request("/todos");
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json).toHaveProperty("data");
            expect(Array.isArray(json.data)).toBe(true);
        });
    });

    describe("POST /todos", () => {
        it("should create a new todo with valid data", async () => {
            const res = await app.request("/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Test todo" }),
            });

            expect(res.status).toBe(201);
            const json = await res.json();
            expect(json.data).toHaveProperty("id");
            expect(json.data.title).toBe("Test");
        });

        it("should return 400 for invalid data (empty title)", async () => {
            const res = await app.request("/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "" }),
            });

            // Valibot validation should reject empty title
            expect(res.status).toBe(400);
        });
    });

    describe("GET /todos/:id", () => {
        it("should return 404 for non-existent todo", async () => {
            const res = await app.request("/todos/999");
            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /todos/:id", () => {
        it("should return 404 when deleting non-existent todo", async () => {
            // Override mock to return empty array (not found)
            const returningMock = (db as any).returning;
            returningMock.mockResolvedValueOnce([]);

            const res = await app.request("/todos/999", {
                method: "DELETE",
            });
            expect(res.status).toBe(404);
        });
    });
});

describe("Health Check", () => {
    it("should return healthy status", async () => {
        const res = await app.request("/health");
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json.status).toBe("healthy");
        expect(json).toHaveProperty("timestamp");
    });
});

describe("Root Endpoint", () => {
    it("should return welcome message", async () => {
        const res = await app.request("/");
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json.message).toContain("Honolulu");
    });
});

describe("404 Handler", () => {
    it("should return 404 for unknown routes", async () => {
        const res = await app.request("/unknown-route");
        expect(res.status).toBe(404);

        const json = await res.json();
        expect(json.error).toBe("Not Found");
    });
});
