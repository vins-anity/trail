import { parse } from "valibot";
import { describe, expect, it } from "vitest";
import { HelloWorldSchema } from "./index";

describe("Shared Schema", () => {
    it("validates hello world message", () => {
        const result = parse(HelloWorldSchema, { message: "Bun" });
        expect(result).toEqual({ message: "Bun" });
    });
});
