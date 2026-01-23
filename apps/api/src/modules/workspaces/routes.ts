
import { Hono } from "hono";
import { workspacesService } from "../../services";

const app = new Hono();

app.get("/current", async (c) => {
    // In a real multi-tenant app, we'd get this from the auth context (JWT)
    // For MVP/Demo, we'll assume a default workspace or fetch the first one
    // In the future: const userId = c.get('jwtPayload').sub;

    // For now, let's just list all and take the first one, 
    // or use a hardcoded ID if we had one.
    // Ideally user is associated with a workspace.

    // Let's assume we pass workspaceId via query param or header for now in the frontend
    // or defaulting to a known demo ID for the "Trail Enterprise" workspace we saw in settings.

    let workspaceId = c.req.query("workspaceId");

    let workspace;

    if (workspaceId) {
        workspace = await workspacesService.getWorkspaceById(workspaceId);
    } else {
        // Fallback: Get the first workspace found (Demo mode)
        const all = await workspacesService.listWorkspaces();
        if (all.length > 0 && all[0]) {
            workspace = await workspacesService.getWorkspaceById(all[0].id);
        } else {
            // AUTO-SEED: If no workspace exists, create one for the demo
            console.log("[Auto-Seed] Creating default workspace...");
            workspace = await workspacesService.createWorkspace({
                name: "My Agency",
            });
        }
    }

    if (!workspace) {
        // Should be impossible given the auto-seed above, but safe guard
        return c.json({ error: "Workspace not found" }, 404);
    }

    // Return status flags only, NOT the actual tokens
    return c.json({
        id: workspace.id,
        name: workspace.name,
        hasSlack: !!(workspace.slackTeamId || workspace.slackAccessToken),
        hasGithub: !!(workspace.githubOrg || workspace.githubInstallationId),
        hasJira: !!(workspace.jiraSite || workspace.jiraAccessToken),
        defaultPolicyTier: workspace.defaultPolicyTier,
    });
});

export default app;
