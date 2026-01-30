import { type Context, Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/valibot";
import * as v from "valibot";
import * as authService from "../../services/auth.service";

/**
 * Auth Module - OAuth Flows
 *
 * Handles OAuth authorization and callbacks for Slack, GitHub, and Jira.
 */

/**
 * Helper to construct the redirect URI.
 * Forces HTTPS if running in production or on Render.
 */
function getRedirectUri(c: Context, path: string): string {
    const url = new URL(c.req.url);

    // Check if we're on Render or in production
    const isRender = url.hostname.includes("onrender.com");
    const isProduction = process.env.NODE_ENV === "production";

    // Force HTTPS for production/Render
    const protocol = (isProduction || isRender) ? "https:" : url.protocol;

    return `${protocol}//${url.host}${path}`;
}

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
                400: { description: "Bad Request" },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspace_id");
            const next = c.req.query("next");

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

            const redirectUri = getRedirectUri(c, "/auth/slack/callback");

            try {
                const state = JSON.stringify({ workspaceId, next });
                const authUrl = authService.getAuthorizationUrl("slack", state, redirectUri);
                return c.redirect(authUrl);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to initiate Slack OAuth";
                return c.json({ error: message }, 400);
            }
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
                400: { description: "Bad Request" },
            },
        }),
        async (c) => {
            const code = c.req.query("code");
            const state = c.req.query("state");
            const error = c.req.query("error") || c.req.query("error_description");

            // Handle user cancellation or provider error
            if (error) {
                const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
                return c.redirect(`${frontendUrl}/onboarding?step=integrations&error=${encodeURIComponent(error)}`);
            }

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            try {
                const { workspaceId, next } = JSON.parse(state);

                // For callback exchange, we must strictly match the redirect URI sent during authorize
                const redirectUri = getRedirectUri(c, "/auth/slack/callback");

                const tokens = await authService.exchangeCodeForToken("slack", code, redirectUri);
                await authService.storeOAuthToken(
                    workspaceId,
                    "slack",
                    tokens.accessToken,
                    tokens.refreshToken,
                );

                // Redirect back to frontend
                const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
                const nextPath = next || "/?connected=slack";
                return c.redirect(`${frontendUrl}${nextPath}`);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to complete Slack OAuth";
                return c.json({ error: message }, 400);
            }
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
                400: { description: "Bad Request" },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspace_id");
            const next = c.req.query("next");

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

            const redirectUri = getRedirectUri(c, "/auth/github/callback");

            try {
                const state = JSON.stringify({ workspaceId, next });
                const authUrl = authService.getAuthorizationUrl("github", state, redirectUri);
                return c.redirect(authUrl);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to initiate GitHub OAuth";
                return c.json({ error: message }, 400);
            }
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
                400: { description: "Bad Request" },
            },
        }),
        async (c) => {
            const code = c.req.query("code");
            const state = c.req.query("state");
            const error = c.req.query("error") || c.req.query("error_description");

            // Handle user cancellation or provider error
            if (error) {
                const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
                return c.redirect(`${frontendUrl}/onboarding?step=integrations&error=${encodeURIComponent(error)}`);
            }

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            try {
                const { workspaceId, next } = JSON.parse(state);

                const redirectUri = getRedirectUri(c, "/auth/github/callback");

                const tokens = await authService.exchangeCodeForToken("github", code, redirectUri);
                await authService.storeOAuthToken(
                    workspaceId,
                    "github",
                    tokens.accessToken,
                    tokens.refreshToken,
                );

                // Redirect back to frontend
                const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
                const nextPath = next || "/?connected=github";
                return c.redirect(`${frontendUrl}${nextPath}`);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to complete GitHub OAuth";
                return c.json({ error: message }, 400);
            }
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
                400: { description: "Bad Request" },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspace_id");
            const next = c.req.query("next");

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

            const redirectUri = getRedirectUri(c, "/auth/jira/callback");

            try {
                const state = JSON.stringify({ workspaceId, next });
                const authUrl = authService.getAuthorizationUrl("jira", state, redirectUri);
                return c.redirect(authUrl);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to initiate Jira OAuth";
                return c.json({ error: message }, 400);
            }
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
                400: { description: "Bad Request" },
            },
        }),
        async (c) => {
            const code = c.req.query("code");
            const state = c.req.query("state");
            const error = c.req.query("error") || c.req.query("error_description");

            // Handle user cancellation or provider error
            if (error) {
                const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
                return c.redirect(`${frontendUrl}/onboarding?step=integrations&error=${encodeURIComponent(error)}`);
            }

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            try {
                const { workspaceId, next } = JSON.parse(state);

                const redirectUri = getRedirectUri(c, "/auth/jira/callback");

                const tokens = await authService.exchangeCodeForToken("jira", code, redirectUri);
                await authService.storeOAuthToken(
                    workspaceId,
                    "jira",
                    tokens.accessToken,
                    tokens.refreshToken,
                    tokens.cloudId,
                );

                // Redirect back to frontend
                const frontendUrl = process.env.FRONTEND_URL || "https://trail-web.pages.dev";
                const nextPath = next || "/?connected=jira";
                return c.redirect(`${frontendUrl}${nextPath}`);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to complete Jira OAuth";
                return c.json({ error: message }, 400);
            }
        },
    );

export default auth;
export type AuthApp = typeof auth;
