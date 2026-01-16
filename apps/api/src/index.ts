import { openAPISpecs } from "hono-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Honolulu API</title>
    <style>
        body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fafafa; color: #333; }
        .container { text-align: center; padding: 2rem; border-radius: 8px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { margin: 0 0 1rem; color: #ea580c; }
        a { color: #ea580c; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌺 Honolulu API</h1>
        <p>Minimal setup. Ready to build.</p>
        <p><a href="/reference">View API Docs</a></p>
    </div>
</body>
</html>
`);
});


// ============================================
// OpenAPI Documentation
// ============================================

app.get(
    "/doc",
    openAPISpecs(app, {
        documentation: {
            info: {
                title: "Honolulu API",
                version: "1.0.0",
                description: "API Documentation",
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
