import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/valibot";
import * as v from "valibot";
import * as authService from "../../services/auth.service";

/**
 * Auth Module - OAuth Flows
 *
 * Handles OAuth authorization and callbacks for Slack, GitHub, and Jira.
 */

const auth = new Hono()
    // ----------------------------------------
    // Slack OAuth
    // ----------------------------------------
    .get(
        "/slack/authorize",
        describeRoute({
            tags: ["Auth"],
            summary: "Initiate Slack OAuth flow",
            description: "Redirects to Slack OAuth authorization page",
            responses: {
                302: { description: "Redirect to Slack" },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspace_id");
            const redirectUri = `${c.req.url.split("/auth")[0]}/auth/slack/callback`;

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

            const state = JSON.stringify({ workspaceId });
            const authUrl = authService.getAuthorizationUrl("slack", state, redirectUri);

            return c.redirect(authUrl);
        },
    )
    .get(
        "/slack/callback",
        describeRoute({
            tags: ["Auth"],
            summary: "Slack OAuth callback",
            description: "Handles Slack OAuth callback",
            responses: {
                200: {
                    description: "OAuth successful",
                    content: {
                        "application/json": {
                            schema: resolver(v.object({ success: v.boolean() })),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const code = c.req.query("code");
            const state = c.req.query("state");

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            const { workspaceId } = JSON.parse(state);
            const redirectUri = `${c.req.url.split("?")[0]}`;

            const tokens = await authService.exchangeCodeForToken("slack", code, redirectUri);
            await authService.storeOAuthToken(
                workspaceId,
                "slack",
                tokens.accessToken,
                tokens.refreshToken,
            );

            // Redirect back to frontend dashboard
            const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
            return c.redirect(`${frontendUrl}/?connected=slack`);
        },
    )

    // ----------------------------------------
    // GitHub OAuth
    // ----------------------------------------
    .get(
        "/github/authorize",
        describeRoute({
            tags: ["Auth"],
            summary: "Initiate GitHub OAuth flow",
            description: "Redirects to GitHub OAuth authorization page",
            responses: {
                302: { description: "Redirect to GitHub" },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspace_id");
            const redirectUri = `${c.req.url.split("/auth")[0]}/auth/github/callback`;

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

            const state = JSON.stringify({ workspaceId });
            const authUrl = authService.getAuthorizationUrl("github", state, redirectUri);

            return c.redirect(authUrl);
        },
    )
    .get(
        "/github/callback",
        describeRoute({
            tags: ["Auth"],
            summary: "GitHub OAuth callback",
            description: "Handles GitHub OAuth callback",
            responses: {
                200: { description: "OAuth successful" },
            },
        }),
        async (c) => {
            const code = c.req.query("code");
            const state = c.req.query("state");

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            const { workspaceId } = JSON.parse(state);
            const redirectUri = `${c.req.url.split("?")[0]}`;

            const tokens = await authService.exchangeCodeForToken("github", code, redirectUri);
            await authService.storeOAuthToken(
                workspaceId,
                "github",
                tokens.accessToken,
                tokens.refreshToken,
            );

            // Redirect back to frontend dashboard
            const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
            return c.redirect(`${frontendUrl}/?connected=github`);
        },
    )

    // ----------------------------------------
    // Jira OAuth
    // ----------------------------------------
    .get(
        "/jira/authorize",
        describeRoute({
            tags: ["Auth"],
            summary: "Initiate Jira OAuth flow",
            description: "Redirects to Jira OAuth authorization page",
            responses: {
                302: { description: "Redirect to Jira" },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspace_id");
            const redirectUri = `${c.req.url.split("/auth")[0]}/auth/jira/callback`;

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

            const state = JSON.stringify({ workspaceId });
            const authUrl = authService.getAuthorizationUrl("jira", state, redirectUri);

            return c.redirect(authUrl);
        },
    )
    .get(
        "/jira/callback",
        describeRoute({
            tags: ["Auth"],
            summary: "Jira OAuth callback",
            description: "Handles Jira OAuth callback",
            responses: {
                200: { description: "OAuth successful" },
            },
        }),
        async (c) => {
            const code = c.req.query("code");
            const state = c.req.query("state");

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            const { workspaceId } = JSON.parse(state);
            const redirectUri = `${c.req.url.split("?")[0]}`;

            const tokens = await authService.exchangeCodeForToken("jira", code, redirectUri);
            await authService.storeOAuthToken(
                workspaceId,
                "jira",
                tokens.accessToken,
                tokens.refreshToken,
            );

            // Redirect back to frontend dashboard
            const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
            return c.redirect(`${frontendUrl}/?connected=jira`);
        },
    );

export default auth;
export type AuthApp = typeof auth;
