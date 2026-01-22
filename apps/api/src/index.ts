import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { openAPISpecs } from "hono-openapi";
import auth from "./modules/auth/routes";
import events from "./modules/events/routes";
import jobs from "./modules/jobs/routes";
import policies from "./modules/policies/routes";
import proofs from "./modules/proofs/routes";
import slackInteractions from "./modules/slack/interactions";
import webhooks from "./modules/webhooks/routes";
import { eventsService } from "./services";

const app = new Hono()
    .use("*", logger())
    .use("*", cors())
    .get("/health", (c) => c.json({ status: "ok" }))
    .get("/", (c) => {
        return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trail AI API</title>
    <style>
        body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fafafa; color: #333; }
        .container { text-align: center; padding: 2rem; border-radius: 8px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { margin: 0 0 1rem; color: #0ea5e9; }
        a { color: #0ea5e9; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛤️ Trail AI API</h1>
        <p>Delivery Assurance & Evidence-Based Audit System</p>
        <p><a href="/reference">View API Docs</a></p>
    </div>
</body>
</html>
`);
    })
    .route("/auth", auth)
    .route("/webhooks", webhooks)
    .route("/slack/interactions", slackInteractions)
    .route("/jobs", jobs)
    .route("/proofs", proofs)
    .route("/policies", policies)
    .route("/events", events)
    // Dashboard Stats
    .get("/stats", async (c) => {
        const workspaceId = c.req.query("workspaceId");
        const stats = await eventsService.getDashboardStats(workspaceId);
        return c.json(stats);
    });

// ============================================
// OpenAPI Documentation
// ============================================
app.get(
    "/doc",
    openAPISpecs(app, {
        documentation: {
            info: {
                title: "Trail AI API",
                version: "1.0.0",
                description:
                    "Delivery Assurance & Evidence-Based Audit System for Software Agencies",
            },
            servers: [
                {
                    url: "http://localhost:3000",
                    description: "Local Server",
                },
            ],
        },
    }),
);

app.get(
    "/reference",
    apiReference({
        theme: "saturn",
        spec: {
            url: "/doc",
        },
    }),
);

export default app;
export type AppType = typeof app;
