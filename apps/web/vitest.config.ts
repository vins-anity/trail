/// <reference types="vitest" />

import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.ts",
        include: ["src/**/*.test.{ts,tsx}"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@web": path.resolve(__dirname, "./src"),
            "@shared": path.resolve(__dirname, "../shared/src"),
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@web": path.resolve(__dirname, "./src"),
            "@shared": path.resolve(__dirname, "../shared/src"),
        },
    },
});
