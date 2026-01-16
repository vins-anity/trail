import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { CreateTodoSchema, HelloWorldSchema, TodoIdSchema, UpdateTodoSchema } from "../index";

describe("Validation Schemas", () => {
    describe("HelloWorldSchema", () => {
        it("should validate a valid message", () => {
            const result = v.safeParse(HelloWorldSchema, { message: "World" });
            expect(result.success).toBe(true);
        });

        it("should reject missing message", () => {
            const result = v.safeParse(HelloWorldSchema, {});
            expect(result.success).toBe(false);
        });
    });

    describe("CreateTodoSchema", () => {
        it("should validate a valid todo", () => {
            const result = v.safeParse(CreateTodoSchema, {
                title: "Buy groceries",
                description: "Milk, eggs, bread",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.output.title).toBe("Buy groceries");
                expect(result.output.description).toBe("Milk, eggs, bread");
            }
        });

        it("should validate todo without description", () => {
            const result = v.safeParse(CreateTodoSchema, {
                title: "Simple task",
            });
            expect(result.success).toBe(true);
        });

        it("should reject empty title", () => {
            const result = v.safeParse(CreateTodoSchema, {
                title: "",
            });
            expect(result.success).toBe(false);
        });

        it("should reject missing title", () => {
            const result = v.safeParse(CreateTodoSchema, {
                description: "No title provided",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("UpdateTodoSchema", () => {
        it("should validate partial update with title only", () => {
            const result = v.safeParse(UpdateTodoSchema, {
                title: "Updated title",
            });
            expect(result.success).toBe(true);
        });

        it("should validate partial update with completed only", () => {
            const result = v.safeParse(UpdateTodoSchema, {
                completed: true,
            });
            expect(result.success).toBe(true);
        });

        it("should validate full update", () => {
            const result = v.safeParse(UpdateTodoSchema, {
                title: "Updated",
                description: "New description",
                completed: true,
            });
            expect(result.success).toBe(true);
        });

        it("should validate empty update (no fields)", () => {
            const result = v.safeParse(UpdateTodoSchema, {});
            expect(result.success).toBe(true);
        });

        it("should reject empty title string", () => {
            const result = v.safeParse(UpdateTodoSchema, {
                title: "",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("TodoIdSchema", () => {
        it("should parse string ID to number", () => {
            const result = v.safeParse(TodoIdSchema, { id: "123" });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.output.id).toBe(123);
            }
        });

        it("should reject non-numeric string", () => {
            const result = v.safeParse(TodoIdSchema, { id: "abc" });
            expect(result.success).toBe(false);
        });
    });
});
