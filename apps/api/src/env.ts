import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
    server: {
        // App
        NODE_ENV: v.optional(v.picklist(["development", "test", "production"]), "development"),
        PORT: v.optional(v.pipe(v.string(), v.transform(Number)), "3000"),
        FRONTEND_URL: v.optional(v.pipe(v.string(), v.url())),

        // Supabase
        DATABASE_URL: v.optional(v.pipe(v.string(), v.minLength(1))),
        SUPABASE_URL: v.optional(v.pipe(v.string(), v.url())),
        SUPABASE_ANON_KEY: v.optional(v.pipe(v.string(), v.minLength(1))),
        SUPABASE_SERVICE_ROLE_KEY: v.optional(v.pipe(v.string(), v.minLength(1))),

        // Security
        ENCRYPTION_KEY: v.optional(v.pipe(v.string(), v.minLength(32))),

        // AI
        GEMINI_API_KEY: v.optional(v.string()),
        OPENROUTER_API_KEY: v.optional(v.string()),

        // OAuth / Integrations
        SLACK_SIGNING_SECRET: v.optional(v.string()),
        SLACK_BOT_TOKEN: v.optional(v.string()),
        SLACK_CLIENT_ID: v.optional(v.string()),
        SLACK_CLIENT_SECRET: v.optional(v.string()),

        GITHUB_APP_ID: v.optional(v.string()),
        GITHUB_CLIENT_ID: v.optional(v.string()),
        GITHUB_CLIENT_SECRET: v.optional(v.string()),
        GITHUB_WEBHOOK_SECRET: v.optional(v.string()),

        JIRA_CLIENT_ID: v.optional(v.string()),
        JIRA_CLIENT_SECRET: v.optional(v.string()),
        JIRA_WEBHOOK_SECRET: v.optional(v.string()),
        JIRA_HOST: v.optional(v.string()),
        JIRA_EMAIL: v.optional(v.string()),
        JIRA_API_TOKEN: v.optional(v.string()),

        // Demo / Seeding
        SEED_EMAIL: v.optional(v.pipe(v.string(), v.email())),
        SEED_PASSWORD: v.optional(v.string()),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
