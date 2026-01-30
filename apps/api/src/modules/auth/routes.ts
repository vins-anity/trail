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
                400: { description: "Bad Request" },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspace_id");
            const next = c.req.query("next");
            const redirectUri = `${c.req.url.split("/auth")[0]}/auth/slack/callback`;

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

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

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            try {
                const { workspaceId, next } = JSON.parse(state);
                const redirectUri = `${c.req.url.split("?")[0]}`;

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
            const redirectUri = `${c.req.url.split("/auth")[0]}/auth/github/callback`;

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

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

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            try {
                const { workspaceId, next } = JSON.parse(state);
                const redirectUri = `${c.req.url.split("?")[0]}`;

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
            const redirectUri = `${c.req.url.split("/auth")[0]}/auth/jira/callback`;

            if (!workspaceId) {
                return c.json({ error: "workspace_id required" }, 400);
            }

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

            if (!code || !state) {
                return c.json({ error: "Invalid OAuth callback" }, 400);
            }

            try {
                const { workspaceId, next } = JSON.parse(state);
                const redirectUri = `${c.req.url.split("?")[0]}`;

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
