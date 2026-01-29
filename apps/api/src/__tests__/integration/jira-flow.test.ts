import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../index";
import * as authService from "../../services/auth.service";
import * as slackService from "../../services/slack.service";

// Mock external services but keep logic internal if possible
// For integration, we want to mock the *network* calls to Jira/Slack/GitHub
// but keep our service logic intact.

/**
 * INTEGRATION TEST: Onboarding & Event Flow
 *
 * This test validates the entire backend API sequence that the Frontend Onboarding Wizard relies on.
 * It ensures the contract between Frontend and Backend is solid for:
 * 1. "Create Workspace" Step (POST /workspaces)
 * 2. "Connect Jira" Step (OAuth Callback /auth/jira/callback)
 * 3. Event Processing (Passive Handshake via Webhooks)
 *
 * RELATING TO FRONTEND:
 * - The <OnboardingPage /> component submits strings to these endpoints.
 * - This test ensures the backend accepts those strings and transitions state correctly.
 *
 * FUTURE IMPROVEMENT (Context7 Research):
 * - To verify the actual React UI components (clicking buttons), we should implement
 *   Vitest Browser Mode (vitest-browser).
 * - This would allow us to mount the <OnboardingPage />, click "Connect Jira", and intercept
 *   the network calls, merging frontend and backend integration validation.
 */

// Mock Supabase Auth to bypass actual token verification
vi.mock("../../middleware/supabase-auth", () => ({
    supabaseAuth: async (c: any, next: any) => {
        // inject mock user
        c.set("user", { id: "test-user-id", email: "test@example.com" });
        await next();
    },
    optionalAuth: async (c: any, next: any) => {
        c.set("user", { id: "test-user-id", email: "test@example.com" });
        await next();
    },
}));

// Mock DB to prevent connection errors
vi.mock("../../db", () => ({
    db: {
        insert: vi.fn((table) => {
            if (table === "events") {
                return {
                    values: vi.fn(() => ({
                        returning: vi.fn().mockResolvedValue([
                            {
                                id: "event-123",
                                workspaceId: "workspace-123",
                                eventType: "handshake",
                                createdAt: new Date(),
                                payload: {},
                                triggerSource: "test",
                                prevHash: "genesis",
                                eventHash: "hash-123",
                                rejectedAt: null,
                                vetoedAt: null,
                            },
                        ]),
                    })),
                };
            }
            // Default to workspaces
            return {
                values: vi.fn(() => ({
                    returning: vi.fn().mockResolvedValue([
                        {
                            id: "workspace-123",
                            name: "Integration Test Corp",
                            ownerId: "test-user-id",
                        },
                    ]),
                })),
            };
        }),
        query: {
            workspaces: {
                findFirst: vi.fn().mockResolvedValue({
                    id: "workspace-123",
                    name: "Integration Test Corp",
                    ownerId: "test-user-id",
                    jiraAccessToken: "encrypted-token",
                    jiraSite: "cloud-id",
                }),
            },
            users: {
                findFirst: vi.fn().mockResolvedValue({ id: "test-user-id" }),
            },
        },
        update: vi.fn(() => ({
            set: vi.fn(() => ({
                where: vi.fn(() => ({
                    returning: vi.fn().mockResolvedValue([
                        {
                            id: "workspace-123",
                            name: "Integration Test Corp",
                            ownerId: "test-user-id",
                            jiraAccessToken: "encrypted-token",
                        },
                    ]),
                })),
            })),
        })),
        select: vi.fn(() => ({
            from: vi.fn((table) => {
                // Handle Workspace Lookup (findByJiraSite)
                if (table === "workspaces") {
                    return {
                        where: vi.fn(() => ({
                            limit: vi.fn(() => ({
                                then: vi.fn((resolve) =>
                                    resolve([
                                        {
                                            id: "workspace-123",
                                            name: "Integration Test Corp",
                                            ownerId: "test-user-id",
                                            jiraAccessToken: "encrypted-token",
                                            jiraSite: "test.atlassian.net",
                                            slackAccessToken: "mock-slack-token",
                                        },
                                    ]),
                                ),
                            })),
                        })),
                    };
                }
                // Handle Event Hash Lookup (getLatestEventHash)
                if (table === "events") {
                    return {
                        where: vi.fn(() => ({
                            orderBy: vi.fn(() => ({
                                limit: vi.fn(() => ({
                                    then: vi.fn((resolve) => resolve([])), // No prior events, genesis
                                })),
                            })),
                        })),
                    };
                }
                return { where: vi.fn() };
            }),
        })),
        transaction: vi.fn((cb) =>
            cb({
                insert: vi.fn((table) => {
                    if (table === "workspaces") {
                        return {
                            values: vi.fn(() => ({
                                returning: vi.fn().mockResolvedValue([
                                    {
                                        id: "workspace-123",
                                        name: "Integration Test Corp",
                                        ownerId: "test-user-id",
                                    },
                                ]),
                            })),
                        };
                    }
                    // Default
                    return {
                        values: vi.fn(() => ({
                            returning: vi.fn().mockResolvedValue([{}]),
                        })),
                    };
                }),
                query: { workspace_members: { findFirst: vi.fn() } },
                update: vi.fn(() => ({
                    set: vi.fn(() => ({
                        where: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{}]) })),
                    })),
                })),
            }),
        ),
    },
    schema: {
        workspaces: "workspaces",
        workspaceMembers: "workspace_members",
        users: "users",
        events: "events",
    },
}));

// Mock schema file directly because likely hash-chain imports it directly
vi.mock("../../db/schema", () => ({
    events: "events",
    workspaces: "workspaces",
    workspaceMembers: "workspace_members",
    users: "users",
}));

// Mock env to propagate process.env changes
vi.mock("../../env", () => ({
    env: {
        get ENCRYPTION_KEY() {
            return process.env.ENCRYPTION_KEY;
        },
        // Add other env vars if needed
    },
}));

// Mock token encryption to avoid WebCrypto errors with dummy data
vi.mock("../../lib/token-encryption", () => ({
    encryptToken: vi.fn(async (token) => `encrypted-${token}`),
    decryptToken: vi.fn(async (token) => token.replace("encrypted-", "")),
    generateEncryptionKey: vi.fn(() => "mock-key-32-bytes"),
}));

describe("Integration: Onboarding & Event Flow", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        // Set valid encryption key for token helper (though now mocked)
        process.env.ENCRYPTION_KEY =
            "0000000000000000000000000000000000000000000000000000000000000000";
    });

    it("should allow a user to onboard and receive a handshake notification", async () => {
        // --------------------------------------------------------------------------------
        // 1. Create Workspace
        // Relates to: <OnboardingPage /> - "Create Workspace" form submission.
        // The user fills in the name and clicks "Create Workspace".
        // --------------------------------------------------------------------------------

        // Simulate a request to POST /workspaces
        const createWorkspaceRes = await app.request("/workspaces", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Mock Supabase Auth header (middleware should mock this in test env)
                Authorization: "Bearer mock-user-token",
            },
            body: JSON.stringify({ name: "Integration Test Corp" }),
        });

        expect(createWorkspaceRes.status).toBe(201);
        const workspace = await createWorkspaceRes.json();
        expect(workspace.id).toBeDefined();

        // --------------------------------------------------------------------------------
        // 2. Connect Jira (Simulate OAuth Callback)
        // Relates to: <OnboardingPage /> - "Connect Jira" button.
        // User clicks "Connect Jira" -> Redirects to Jira -> Redirects back to /auth/jira/callback
        // --------------------------------------------------------------------------------

        // We bypass the actual redirect and hit the callback directly with a mock code
        // We need to mock authService.exchangeCodeForToken to return a "valid" token for the test

        vi.spyOn(authService, "exchangeCodeForToken").mockResolvedValue({
            accessToken: "mock-jira-access-token",
            refreshToken: "mock-jira-refresh-token",
            expiresIn: 3600,
            cloudId: "mock-jira-cloud-id",
        });

        const jiraCallbackRes = await app.request(
            `/auth/jira/callback?code=mock-code&state=${JSON.stringify({ workspaceId: workspace.id })}`,
            {
                method: "GET",
            },
        );

        expect(jiraCallbackRes.status).toBe(302); // Redirects to dashboard

        // Verify Jira token is stored (by checking if we can fetch it? or assuming success from redirect)
        // Ideally we'd check DB, but let's rely on the behavior:

        // --------------------------------------------------------------------------------
        // 3. Simulate Jira Webhook (Task -> In Progress)
        // This triggers the "Passive Handshake" - verifying the integrations work together.
        // --------------------------------------------------------------------------------

        const webhookPayload = {
            webhookEvent: "jira:issue_updated",
            issue: {
                self: "https://test.atlassian.net/rest/api/2/issue/10001", // Required for domain extraction
                key: "TRAIL-101",
                fields: {
                    summary: "Implement Integration Tests",
                    status: { name: "In Progress" },
                    assignee: { emailAddress: "dev@test.com" },
                },
            },
            changelog: {
                items: [{ field: "status", toString: "In Progress", fromString: "To Do" }],
            },
        };

        // We need to spy on SlackService to ensure it sends the notification
        const slackSpy = vi.spyOn(slackService, "sendHandshakeNotification");

        // Also need to ensure the workspace has Slack connected for this to really work
        // Let's "Connect" Slack too manually/conceptually
        vi.spyOn(authService, "getOAuthToken").mockImplementation(async (wsId, provider) => {
            if (provider === "jira") return "mock-jira-access-token";
            if (provider === "slack") return "mock-slack-access-token"; // We simulate slack is connected
            return null;
        });

        // Make the webhook request
        const webhookRes = await app.request("/webhooks/jira", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(webhookPayload),
        });

        expect(webhookRes.status).toBe(200);

        // 4. Verify Slack Notification
        expect(slackSpy).toHaveBeenCalledWith(
            workspace.id,
            "TRAIL-101",
            "Implement Integration Tests",
            "dev@test.com",
        );
    });
});
