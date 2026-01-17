import * as v from "valibot";

const envSchema = v.object({
    NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "development"),
    PORT: v.optional(v.pipe(v.string(), v.transform(Number)), "3000"),

    // Supabase
    SUPABASE_URL: v.optional(v.pipe(v.string(), v.url())),
    SUPABASE_ANON_KEY: v.optional(v.string()),
    SUPABASE_SERVICE_ROLE_KEY: v.optional(v.string()),
    DATABASE_URL: v.optional(v.string()),

    // AI
    GEMINI_API_KEY: v.optional(v.string()),

    // Integrations
    SLACK_SIGNING_SECRET: v.optional(v.string()),
    SLACK_BOT_TOKEN: v.optional(v.string()),
    GITHUB_WEBHOOK_SECRET: v.optional(v.string()),
    JIRA_WEBHOOK_SECRET: v.optional(v.string()),
});

export const env = v.parse(envSchema, process.env);
export type Env = v.InferOutput<typeof envSchema>;
