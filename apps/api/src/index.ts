import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { openAPISpecs } from "hono-openapi";
import { env } from "./env";
import { startJobQueue } from "./lib/job-queue";
import auth from "./modules/auth/routes";
import events from "./modules/events/routes";
import jobs from "./modules/jobs/routes";
import onboarding from "./modules/onboarding/routes";
import policies from "./modules/policies/routes";
import proofs from "./modules/proofs/routes";
import slackInteractions from "./modules/slack/interactions";
import webhooks from "./modules/webhooks/routes";
import workspaces from "./modules/workspaces/routes";

// Start the background worker (Free Tier Strategy)
// In production, we run this in the same process to avoid paying for a second service.
if (process.env.NODE_ENV !== "test") {
    startJobQueue().catch((err) => {
        console.error("Failed to start background worker:", err);
    });
}

const app = new Hono()
    .use("*", logger())
    .use(
        "*",
        secureHeaders({
            contentSecurityPolicy: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https://*.supabase.co"],
                connectSrc: [
                    "'self'",
                    "https://*.supabase.co",
                    "https://shipdocket-api-sqoi.onrender.com",
                ],
                frameAncestors: ["'none'"],
            },
            strictTransportSecurity: "max-age=31536000; includeSubDomains; preload",
            xFrameOptions: "DENY",
            xContentTypeOptions: "nosniff",
            referrerPolicy: "strict-origin-when-cross-origin",
            permissionsPolicy: {
                geolocation: ["'none'"],
                microphone: ["'none'"],
                camera: ["'none'"],
            },
        }),
    )
    .use("*", cors())
    .get("/health", (c) => c.json({ status: "ok" }))
    .get("/", (c) => {
        const frontendUrl = env.FRONTEND_URL || "https://shipdocket.pages.dev/";
        return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShipDocket API</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .glow {
            box-shadow: 0 0 50px -10px rgba(56, 189, 248, 0.15);
        }
    </style>
</head>
<body class="bg-[#020617] text-slate-200 min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden relative">

    <!-- Background Gradients -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="max-w-xl w-full text-center relative z-10 space-y-8">
        
        <!-- Logo / Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide mb-4">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            SYSTEM ONLINE
        </div>

        <!-- Main Heading -->
        <h1 class="text-5xl sm:text-7xl font-black tracking-tight leading-tight">
            <span class="block text-white">ShipDocket</span>
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">API Gateway</span>
        </h1>

        <p class="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
            The neural backbone for Delivery Assurance. 
            Automated auditing, evidence collection, and hash-chain verification.
        </p>

        <!-- Action Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <a href="/reference" class="group glass rounded-xl p-6 text-left hover:bg-white/5 transition-all glow">
                <div class="mb-3 text-blue-400 group-hover:scale-110 transition-transform origin-left">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <h3 class="font-bold text-white mb-1 whitespace-nowrap">API Docs</h3>
                <p class="text-xs text-slate-500">Interactive endpoints reference.</p>
            </a>

            <a href="/status" class="group glass rounded-xl p-6 text-left hover:bg-white/5 transition-all border-green-500/10 hover:border-green-500/30">
                <div class="mb-3 text-green-400 group-hover:scale-110 transition-transform origin-left">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 class="font-bold text-white mb-1 whitespace-nowrap">System Status</h3>
                <p class="text-xs text-slate-500">Live infrastructure monitoring.</p>
            </a>

            <a href="${frontendUrl}" class="group glass rounded-xl p-6 text-left hover:bg-white/5 transition-all mb-4 sm:mb-0">
                <div class="mb-3 text-indigo-400 group-hover:scale-110 transition-transform origin-left">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 class="font-bold text-white mb-1 whitespace-nowrap">Web App</h3>
                <p class="text-xs text-slate-500">Back to the dashboard.</p>
            </a>
        </div>
        
        <div class="pt-8 text-xs text-slate-600 font-mono">
            v1.0.0 • PROD-READY • SECURE
        </div>
    </div>
</body>
</html>
`);
    })
    .route("/auth", auth)
    .route("/webhooks", webhooks)
    .route("/slack/interactions", slackInteractions)
    .route("/jobs", jobs)
    // Public share route - NO AUTH REQUIRED
    .get("/proofs/share/:token", async (c) => {
        const token = c.req.param("token");

        // Import services dynamically
        const { proofSharesService, proofsService, eventsService, workspacesService } =
            await import("./services");

        // Get share link by token
        const shareLink = await proofSharesService?.getShareLinkByToken(token);
        if (!shareLink) {
            return c.json({ error: "Share link not found or expired" }, 404);
        }

        // Check expiration
        if (shareLink.expiresAt && new Date(shareLink.expiresAt) < new Date()) {
            return c.json({ error: "Share link has expired" }, 410);
        }

        // Get the proof packet
        const proof = await proofsService.getProofPacketById(shareLink.proofId);
        if (!proof) {
            return c.json({ error: "Proof packet not found" }, 404);
        }

        // Get events for this proof
        const { events } = await eventsService.listEvents({
            workspaceId: proof.workspaceId,
            taskId: proof.taskId || undefined,
            pageSize: 50,
        });

        // Get workspace info
        const workspace = await workspacesService.getWorkspaceById(proof.workspaceId);

        // Return public-safe response
        return c.json({
            id: proof.id,
            taskId: proof.taskId,
            status: proof.status,
            aiSummary: proof.aiSummary,
            aiSummaryModel: proof.aiSummaryModel,
            hashChainRoot: proof.hashChainRoot,
            closedAt: proof.closedAt,
            createdAt: proof.createdAt,
            events: events.map((e) => ({
                id: e.id,
                eventType: e.eventType,
                createdAt: e.createdAt,
            })),
            workspace: {
                name: workspace?.name || "ShipDocket",
            },
        });
    })
    .route("/proofs", proofs)
    .route("/policies", policies)
    .route("/events", events)
    .route("/workspaces", workspaces)

    // Dashboard Stats

    // Health Status Dashboard
    .get("/status", async (c) => {
        const { healthService } = await import("./services");
        const status = await healthService.getHealthStatus();

        return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Status | ShipDocket</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #020617; color: #f8fafc; }
        .glass { background: rgba(51, 65, 85, 0.3); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .card-glow-ok { box-shadow: 0 0 40px -10px rgba(34, 197, 94, 0.15); }
        .card-glow-error { box-shadow: 0 0 40px -10px rgba(239, 68, 68, 0.15); }
        .card-glow-warning { box-shadow: 0 0 40px -10px rgba(234, 179, 8, 0.15); }
        .pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    </style>
</head>
<body class="min-h-screen p-8 flex flex-col items-center">
    <div class="max-w-4xl w-full space-y-8 animate-in fade-in duration-700">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 class="text-4xl font-black tracking-tight flex items-center gap-3">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">System Monitoring</span>
                </h1>
                <p class="text-slate-500 mt-1 font-medium">ShipDocket API Infrastructure Health</p>
            </div>
            <div class="px-4 py-2 rounded-lg glass text-xs font-mono text-slate-400">
                Last Update: ${new Date(status.timestamp).toLocaleTimeString()}
            </div>
        </div>

        <!-- Main Status Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Overall Status -->
            <div class="md:col-span-2 glass rounded-2xl p-8 flex items-center justify-between ${status.status === "ok" ? "card-glow-ok" : status.status === "warning" ? "card-glow-warning" : "card-glow-error"}">
                <div class="space-y-4">
                    <h2 class="text-lg font-bold text-slate-400 uppercase tracking-widest">Global Status</h2>
                    <div class="flex items-center gap-4">
                        <div class="w-4 h-4 rounded-full ${status.status === "ok" ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : status.status === "warning" ? "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" : "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"} pulse"></div>
                        <span class="text-5xl font-black uppercase">${status.status}</span>
                    </div>
                </div>
                <div class="text-right space-y-1">
                    <p class="text-3xl font-bold text-white">${status.uptime}s</p>
                    <p class="text-xs text-slate-500 font-bold uppercase tracking-tighter">System Uptime</p>
                </div>
            </div>

            <!-- Version Info -->
            <div class="glass rounded-2xl p-8 flex flex-col justify-center items-center text-center">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Build Version</p>
                <p class="text-4xl font-black text-white">v${status.version}</p>
                <p class="text-[10px] mt-4 px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-mono tracking-tighter uppercase font-bold">Production Node</p>
            </div>
        </div>

        <!-- Metric Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Database -->
            <div class="glass rounded-2xl p-6 space-y-4 border-l-4 ${status.checks.database.status === "ok" ? "border-green-500" : "border-red-500"}">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-slate-300">PostgreSQL</h3>
                    <span class="text-xs font-mono ${status.checks.database.status === "ok" ? "text-green-400" : "text-red-400"}">${status.checks.database.latencyMs}ms</span>
                </div>
                <p class="text-sm text-slate-500">${status.checks.database.message || "Connection healthy, latency within limits."}</p>
            </div>

            <!-- Job Queue -->
            <div class="glass rounded-2xl p-6 space-y-4 border-l-4 ${status.checks.jobQueue.status === "ok" ? "border-green-500" : "border-red-500"}">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-slate-300">Job Queue (pg-boss)</h3>
                    <div class="w-2 h-2 rounded-full ${status.checks.jobQueue.status === "ok" ? "bg-green-500" : "bg-red-500"}"></div>
                </div>
                <p class="text-sm text-slate-500">${status.checks.jobQueue.message || "Background worker active and processing."}</p>
            </div>

            <!-- Environment -->
            <div class="glass rounded-2xl p-6 space-y-4 border-l-4 ${status.checks.environment.status === "ok" ? "border-green-500" : "border-yellow-500"}">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-slate-300">Environment</h3>
                    <div class="w-2 h-2 rounded-full ${status.checks.environment.status === "ok" ? "bg-green-500" : "bg-yellow-500"}"></div>
                </div>
                ${status.checks.environment.missingOptionalVars.length > 0
                ? `<p class="text-xs text-yellow-400 font-medium">Missing: ${status.checks.environment.missingOptionalVars.join(", ")}</p>`
                : `<p class="text-sm text-slate-500">All required and optional variables are set.</p>`
            }
            </div>
        </div>

        <!-- Footer -->
        <div class="pt-8 text-center">
            <a href="/" class="text-slate-500 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to API Gateway
            </a>
        </div>
    </div>
</body>
</html>
        `);
    });

// ============================================
// Global Error Handling
// ============================================

app.onError((err, c) => {
    console.error(`Unhandled Error: ${err.message}`);
    console.error(err.stack);

    return c.json(
        {
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development" ? err.message : undefined,
        },
        500,
    );
});

app.notFound((c) => {
    return c.json({ error: "Endpoint not found" }, 404);
});

// ============================================
// OpenAPI Documentation
// ============================================
app.get(
    "/doc",
    openAPISpecs(app, {
        documentation: {
            info: {
                title: "ShipDocket API",
                version: "1.0.0",
                description:
                    "Delivery Assurance & Evidence-Based Audit System for Software Agencies",
            },
            servers: [
                {
                    url: "https://shipdocket-api-sqoi.onrender.com",
                    description: "Production Server",
                },
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

export { app };
export default app;
export type AppType = typeof app;
