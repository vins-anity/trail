/**
 * Auth Service Tests
 *
 * Tests for OAuth flows and token management
 */

import { beforeAll, describe, expect, mock, test } from "bun:test";
import { generateEncryptionKey } from "../lib/token-encryption";
import * as authService from "../services/auth.service";

describe("Auth Service", () => {
    beforeAll(() => {
        // Set test environment variables
        process.env.ENCRYPTION_KEY = generateEncryptionKey();
        process.env.SLACK_CLIENT_ID = "test-slack-client-id";
        process.env.SLACK_CLIENT_SECRET = "test-slack-secret";
        process.env.GITHUB_CLIENT_ID = "test-github-client-id";
        process.env.GITHUB_CLIENT_SECRET = "test-github-secret";
        process.env.JIRA_CLIENT_ID = "test-jira-client-id";
        process.env.JIRA_CLIENT_SECRET = "test-jira-secret";
    });

    describe("getAuthorizationUrl", () => {
        test("should generate Slack OAuth URL with correct params", () => {
            const state = JSON.stringify({ workspaceId: "test-workspace" });
            const redirectUri = "http://localhost:3000/auth/slack/callback";

            const url = authService.getAuthorizationUrl("slack", state, redirectUri);

            expect(url).toContain("https://slack.com/oauth/v2/authorize");
            expect(url).toContain("client_id=test-slack-client-id");
            expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
            expect(url).toContain(`state=${encodeURIComponent(state)}`);
            expect(url).toContain("scope=");
        });

        test("should generate GitHub OAuth URL", () => {
            const state = JSON.stringify({ workspaceId: "test-workspace" });
            const redirectUri = "http://localhost:3000/auth/github/callback";

            const url = authService.getAuthorizationUrl("github", state, redirectUri);

            expect(url).toContain("https://github.com/login/oauth/authorize");
            expect(url).toContain("client_id=test-github-client-id");
        });

        test("should generate Jira OAuth URL", () => {
            const state = JSON.stringify({ workspaceId: "test-workspace" });
            const redirectUri = "http://localhost:3000/auth/jira/callback";

            const url = authService.getAuthorizationUrl("jira", state, redirectUri);

            expect(url).toContain("https://auth.atlassian.com/authorize");
            expect(url).toContain("client_id=test-jira-client-id");
        });

        test("should throw error if client ID not configured", () => {
            const originalClientId = process.env.SLACK_CLIENT_ID;
            delete process.env.SLACK_CLIENT_ID;

            expect(() => {
                authService.getAuthorizationUrl("slack", "state", "redirect");
            }).toThrow("SLACK_CLIENT_ID not configured");

            process.env.SLACK_CLIENT_ID = originalClientId;
        });
    });

    describe("exchangeCodeForToken", () => {
        test("should handle successful OAuth exchange", async () => {
            // Mock fetch for OAuth token exchange
            const mockFetch = mock(() =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            access_token: "xoxb-test-token",
                            refresh_token: "refresh-test-token",
                            expires_in: 3600,
                        }),
                } as Response),
            );

            // @ts-expect-error - Mocking global fetch
            global.fetch = mockFetch;

            const result = await authService.exchangeCodeForToken(
                "slack",
                "test-code",
                "http://localhost:3000/callback",
            );

            expect(result.accessToken).toBe("xoxb-test-token");
            expect(result.refreshToken).toBe("refresh-test-token");
            expect(result.expiresIn).toBe(3600);

            expect(mockFetch).toHaveBeenCalled();
        });

        test("should throw error on failed OAuth exchange", async () => {
            const mockFetch = mock(() =>
                Promise.resolve({
                    ok: false,
                    text: () => Promise.resolve("Invalid code"),
                } as Response),
            );

            // @ts-expect-error - Mocking global fetch
            global.fetch = mockFetch;

            await expect(async () => {
                await authService.exchangeCodeForToken("slack", "bad-code", "redirect");
            }).toThrow("OAuth token exchange failed");
        });

        test("should throw error if credentials not configured", async () => {
            const originalSecret = process.env.GITHUB_CLIENT_SECRET;
            delete process.env.GITHUB_CLIENT_SECRET;

            await expect(async () => {
                await authService.exchangeCodeForToken("github", "code", "redirect");
            }).toThrow("OAuth credentials not configured for github");

            process.env.GITHUB_CLIENT_SECRET = originalSecret;
        });
    });

    describe("createSupabaseClient", () => {
        test("should create client without auth token", () => {
            const client = authService.createSupabaseClient();
            expect(client).toBeDefined();
        });

        test("should create client with auth token", () => {
            const client = authService.createSupabaseClient("test-jwt-token");
            expect(client).toBeDefined();
        });
    });

    describe("OAuth provider types", () => {
        test("should accept valid provider types", () => {
            const providers: authService.OAuthProvider[] = ["slack", "github", "jira"];

            providers.forEach((provider) => {
                expect(() => {
                    authService.getAuthorizationUrl(provider, "state", "redirect");
                }).not.toThrow();
            });
        });
    });
});
