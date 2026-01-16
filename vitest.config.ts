import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Test environment
        environment: "node",

        // Global test timeout
        testTimeout: 10000,

        // Coverage configuration
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/**",
                "dist/**",
                "**/**.d.ts",
                "**/*.test.ts",
                "**/__tests__/**",
            ],
        },

        // Include patterns
        include: ["**/*.test.ts", "**/*.test.tsx"],

        // Path aliases (match tsconfig)
        alias: {
            shared: resolve(__dirname, "./packages/shared/src"),
        },

        // Setup files (if needed)
        // setupFiles: ['./test/setup.ts'],
    },
});
