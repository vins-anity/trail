import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],

    // Path aliases for cleaner imports
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@shared": path.resolve(__dirname, "../shared/src"),
        },
    },

    // Optimize dependency pre-bundling
    optimizeDeps: {
        include: ["react", "react-dom", "@tanstack/react-query", "zustand"],
        exclude: ["shared", "api"],
    },

    // Build optimizations
    build: {
        target: "esnext",
        minify: "esbuild",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    query: ["@tanstack/react-query"],
                },
            },
        },
    },

    // Dev server config
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/api/, ""),
            },
        },
    },

    // Faster esbuild options
    esbuild: {
        target: "esnext",
        legalComments: "none",
    },
});
