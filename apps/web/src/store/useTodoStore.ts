import { create } from "zustand";

interface TodoState {
    filter: "all" | "active" | "completed";
    setFilter: (filter: "all" | "active" | "completed") => void;
}

export const useTodoStore = create<TodoState>((set) => ({
    filter: "all",
    setFilter: (filter) => set({ filter }),
}));
