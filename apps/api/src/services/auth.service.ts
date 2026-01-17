/**
 * Authentication Service
 *
 * Manages OAuth flows for Slack, GitHub, and Jira.
 * Handles token storage with encryption.
 */

import { createClient } from "@supabase/supabase-js";
import { decryptToken, encryptToken } from "../lib/token-encryption";
import * as workspacesService from "./workspaces.service";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

// OAuth endpoints
const OAUTH_CONFIG = {
    slack: {
        authorizeUrl: "https://slack.com/oauth/v2/authorize",
        tokenUrl: "https://slack.com/api/oauth.v2.access",
        scopes: ["chat:write", "users:read", "users:read.email", "app_mentions:read"],
    },
    github: {
        authorizeUrl: "https://github.com/login/oauth/authorize",
        tokenUrl: "https://github.com/login/oauth/access_token",
        scopes: ["read:user", "repo", "write:repo_hook"],
    },
    jira: {
        authorizeUrl: "https://auth.atlassian.com/authorize",
        tokenUrl: "https://auth.atlassian.com/oauth/token",
        scopes: ["read:jira-work", "write:jira-work", "read:jira-user"],
    },
};

export type OAuthProvider = keyof typeof OAUTH_CONFIG;

/**
 * Generate OAuth authorization URL
 */
export function getAuthorizationUrl(
    provider: OAuthProvider,
    state: string,
    redirectUri: string,
): string {
    const config = OAUTH_CONFIG[provider];
    const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];

    if (!clientId) {
        throw new Error(`${provider.toUpperCase()}_CLIENT_ID not configured`);
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        state,
        scope: config.scopes.join(" "),
        response_type: "code",
    });

    return `${config.authorizeUrl}?${params}`;
}

/**
 * Exchange OAuth code for access token
 */
export async function exchangeCodeForToken(
    provider: OAuthProvider,
    code: string,
    redirectUri: string,
): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }> {
    const config = OAUTH_CONFIG[provider];
    const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
    const clientSecret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];

    if (!clientId || !clientSecret) {
        throw new Error(`OAuth credentials not configured for ${provider}`);
    }

    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
    });

    const response = await fetch(config.tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OAuth token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
    };
}

/**
 * Store encrypted OAuth token for workspace
 */
export async function storeOAuthToken(
    workspaceId: string,
    provider: OAuthProvider,
    accessToken: string,
    refreshToken?: string,
): Promise<void> {
    const encryptedAccessToken = await encryptToken(accessToken);
    const _encryptedRefreshToken = refreshToken ? await encryptToken(refreshToken) : undefined;

    const updates: Record<string, string | undefined> = {};

    switch (provider) {
        case "slack":
            updates.slackAccessToken = encryptedAccessToken;
            break;
        case "github":
            // For GitHub Apps, we store installation token differently
            updates.githubInstallationId = encryptedAccessToken;
            break;
        case "jira":
            updates.jiraAccessToken = encryptedAccessToken;
            break;
    }

    await workspacesService.updateWorkspace(workspaceId, updates);
}

/**
 * Retrieve and decrypt OAuth token for workspace
 */
export async function getOAuthToken(
    workspaceId: string,
    provider: OAuthProvider,
): Promise<string | null> {
    const workspace = await workspacesService.getWorkspaceById(workspaceId);

    if (!workspace) {
        throw new Error("Workspace not found");
    }

    let encryptedToken: string | null = null;

    switch (provider) {
        case "slack":
            encryptedToken = workspace.slackAccessToken;
            break;
        case "github":
            encryptedToken = workspace.githubInstallationId;
            break;
        case "jira":
            encryptedToken = workspace.jiraAccessToken;
            break;
    }

    if (!encryptedToken) {
        return null;
    }

    return await decryptToken(encryptedToken);
}

/**
 * Create Supabase client for user authentication
 */
export function createSupabaseClient(authToken?: string) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        },
    });
}

/**
 * Verify Supabase JWT and get user
 */
export async function verifySupabaseToken(token: string) {
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        throw new Error("Invalid or expired token");
    }

    return data.user;
}
