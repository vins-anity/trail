import * as v from "valibot";

export * from "./schemas/todo";

// Example hello world schema
export const HelloWorldSchema = v.object({
    message: v.string(),
});

export type HelloWorld = v.InferOutput<typeof HelloWorldSchema>;
