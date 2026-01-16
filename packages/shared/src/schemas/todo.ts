import * as v from "valibot";

// Todo schemas for API validation
export const CreateTodoSchema = v.object({
    title: v.pipe(v.string(), v.minLength(1, "Title is required")),
    description: v.optional(v.string()),
});

export const UpdateTodoSchema = v.object({
    title: v.optional(v.pipe(v.string(), v.minLength(1, "Title cannot be empty"))),
    description: v.optional(v.string()),
    completed: v.optional(v.boolean()),
});

export const TodoIdSchema = v.object({
    id: v.pipe(v.string(), v.transform(Number), v.number()),
});

// Inferred types
export type CreateTodo = v.InferOutput<typeof CreateTodoSchema>;
export type UpdateTodo = v.InferOutput<typeof UpdateTodoSchema>;
export type TodoId = v.InferOutput<typeof TodoIdSchema>;

// Todo entity type (matches database schema)
export interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
