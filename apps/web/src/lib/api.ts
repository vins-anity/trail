import type { CreateTodo, Todo } from "shared";

const API_URL = "/api"; // Proxied by Vite

export const api = {
    todos: {
        list: async (): Promise<Todo[]> => {
            const res = await fetch(`${API_URL}/todos`);
            if (!res.ok) throw new Error("Failed to fetch todos");
            const { data } = await res.json();
            return data;
        },
        create: async (todo: CreateTodo): Promise<Todo> => {
            const res = await fetch(`${API_URL}/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(todo),
            });
            if (!res.ok) throw new Error("Failed to create todo");
            const { data } = await res.json();
            return data;
        },
        toggle: async (id: number): Promise<Todo> => {
            const res = await fetch(`${API_URL}/todos/${id}/toggle`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to toggle todo");
            const { data } = await res.json();
            return data;
        },
        delete: async (id: number): Promise<Todo> => {
            const res = await fetch(`${API_URL}/todos/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete todo");
            const { data } = await res.json();
            return data;
        },
    },
};
