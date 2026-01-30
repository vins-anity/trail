import { Hono } from "hono";
import { supabaseAuth } from "../../middleware/supabase-auth";
import { workspacesService } from "../../services";

type Variables = {
    userId: string;
    user: unknown;
};

const app = new Hono<{ Variables: Variables }>();

// Apply Supabase Auth middleware to all routes
app.use("*", supabaseAuth);

/**
 * GET /
 * List all workspaces the user is a member of.
 */
app.get("/", async (c) => {
    const userId = c.get("userId") as string;
    const workspaces = await workspacesService.getWorkspacesForUser(userId);
    return c.json(workspaces);
});

/**
 * POST /
 * Create a new workspace.
 */
app.post("/", async (c) => {
    const userId = c.get("userId") as string;
    const body = await c.req.json<{ name: string; defaultPolicyTier?: string }>();

    if (!body.name) {
        return c.json({ error: "Workspace name is required" }, 400);
    }

    try {
        const workspace = await workspacesService.createWorkspace({
            name: body.name,
            userId: userId,
            defaultPolicyTier: body.defaultPolicyTier as
                | "agile"
                | "standard"
                | "hardened"
                | undefined,
        });
        return c.json(workspace, 201);
    } catch (err) {
        console.error("Failed to create workspace:", err);
        return c.json({ error: "Failed to create workspace" }, 500);
    }
});

/**
 * GET /current
 * Legacy/Convenience endpoint for the Dashboard.
 * Returns metadata (not tokens) for the active workspace.
 * Falls back to the first available workspace if no ID provided.
 */
app.get("/current", async (c) => {
    const userId = c.get("userId") as string;
    const workspaceId = c.req.query("workspaceId");

    try {
        const allWorkspaces = await workspacesService.getWorkspacesForUser(userId);

        let workspace = null;

        if (workspaceId) {
            workspace = allWorkspaces.find((w) => w.id === workspaceId);
        } else {
            // Default to the first one found
            workspace = allWorkspaces[0];
        }

        if (!workspace) {
            return c.json({ error: "No workspace found" }, 404);
        }

        // Return sanitized status
        return c.json({
            id: workspace.id,
            name: workspace.name,
            hasSlack: !!(workspace.slackTeamId || workspace.slackAccessToken),
            hasGithub: !!(workspace.githubOrg || workspace.githubInstallationId),
            hasJira: !!(workspace.jiraSite || workspace.jiraAccessToken),
            defaultPolicyTier: workspace.defaultPolicyTier,
            workflowSettings: workspace.workflowSettings,
            onboardingCompletedAt: workspace.onboardingCompletedAt?.toISOString() || null,
        });
    } catch (error) {
        console.error("[/workspaces/current] Database error:", error);
        return c.json({ error: "Failed to fetch workspace" }, 500);
    }
});

/**
 * PATCH /:id
 * Update workspace settings
 */
app.patch("/:id", async (c) => {
    const workspaceId = c.req.param("id");
    const userId = c.get("userId") as string;

    // Verify access
    const hasAccess = await workspacesService.checkAccess(userId, workspaceId);
    if (!hasAccess) return c.json({ error: "Unauthorized" }, 403);

    const body = await c.req.json();

    try {
        // Convert date string if present
        if (body.onboardingCompletedAt) {
            body.onboardingCompletedAt = new Date(body.onboardingCompletedAt);
        }

        const updatePayload: any = {};
        if (body.name !== undefined) updatePayload.name = body.name;
        if (body.defaultPolicyTier !== undefined) updatePayload.defaultPolicyTier = body.defaultPolicyTier;
        if (body.workflowSettings !== undefined) updatePayload.workflowSettings = body.workflowSettings;
        if (body.proofPacketRules !== undefined) updatePayload.proofPacketRules = body.proofPacketRules;
        if (body.onboardingCompletedAt !== undefined) updatePayload.onboardingCompletedAt = body.onboardingCompletedAt;

        const updated = await workspacesService.updateWorkspace(workspaceId, updatePayload);

        return c.json(updated);
    } catch (err) {
        console.error("Failed to update workspace:", err);
        return c.json({ error: "Failed to update workspace" }, 500);
    }
});

/**
 * GET /:id/members
 * Fetch workspace members
 */
app.get("/:id/members", async (c) => {
    const workspaceId = c.req.param("id");
    // Verify access
    const userId = c.get("userId") as string;
    const hasAccess = await workspacesService.checkAccess(userId, workspaceId);
    if (!hasAccess) return c.json({ error: "Unauthorized" }, 403);

    const members = await workspacesService.getWorkspaceMembers(workspaceId);
    return c.json(members);
});

/**
 * GET /:id/audit-log
 * Fetch hash-chained audit log
 */
app.get("/:id/audit-log", async (c) => {
    const workspaceId = c.req.param("id");

    // Verify access
    const userId = c.get("userId") as string;
    const hasAccess = await workspacesService.checkAccess(userId, workspaceId);
    if (!hasAccess) return c.json({ error: "Unauthorized" }, 403);

    // Dynamic import to avoid circular dependency issues if any, though eventsService is clean
    const { eventsService } = await import("../../services");
    const logs = await eventsService.getAuditLog(workspaceId);
    return c.json(logs);
});

/**
 * PATCH /:id/branding
 * Update branding settings
 */
app.patch("/:id/branding", async (c) => {
    // TODO: Implement branding update
    return c.json({ success: true });
});

export default app;
