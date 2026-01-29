import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../index";
import * as authService from "../../services/auth.service";
import * as slackService from "../../services/slack.service";

/**
 * E2E INTEGRATION TEST: Full ShipDocket Workflow
 *
 * This test simulates the complete user journey:
 * 1. User creates a new workspace (or selects existing).
 * 2. User connects multiple providers (Jira, Slack, GitHub).
 * 3. Middleware processes an incoming event (Jira Issue Update).
 * 4. System reacts by chaining the event (Hash Chain) and notifying downstream (Slack).
 */

// ---------------------------------------------------------------------------
// MOCKS
// ---------------------------------------------------------------------------

// Mock Supabase Auth
vi.mock("../../middleware/supabase-auth", () => ({
    supabaseAuth: async (c: any, next: any) => {
        c.set("user", { id: "test-user-id", email: "e2e@test.com" });
        await next();
    },
    optionalAuth: async (c: any, next: any) => {
        c.set("user", { id: "test-user-id", email: "e2e@test.com" });
        await next();
    },
}));

// Mock Database to simulate state persistence across steps
// We use a simple in-memory object to act as our "DB" for this test run
const mockDbState = {
    workspaces: new Map(),
    events: [] as any[],
};

vi.mock("../../db", () => ({
    db: {
        insert: vi.fn((table) => ({
            values: vi.fn((data) => ({
                returning: vi.fn().mockImplementation(async () => {
                    if (table === "workspaces") {
                        const id = "ws-e2e-123";
                        const ws = { ...data, id, ownerId: "test-user-id" };
                        mockDbState.workspaces.set(id, ws);
                        return [ws];
                    }
                    if (table === "events") {
                        const id = `evt-${mockDbState.events.length + 1}`;
                        // Logic to simulate "middleware" adding previous hash would happen in service,
                        // but here we just store what the service passes us.
                        const evt = { ...data, id, createdAt: new Date() };
                        mockDbState.events.push(evt);
                        return [evt];
                    }
                    return [{}];
                }),
            })),
        })),
        query: {
            workspaces: {
                findFirst: vi.fn().mockImplementation(async ({ where }) => {
                    // Simplified lookup mock
                    return mockDbState.workspaces.get("ws-e2e-123");
                }),
            },
            users: {
                findFirst: vi.fn().mockResolvedValue({ id: "test-user-id" }),
            },
        },
        update: vi.fn(() => ({
            set: vi.fn((data) => ({
                where: vi.fn(() => ({
                    returning: vi.fn().mockImplementation(async () => {
                        const ws = mockDbState.workspaces.get("ws-e2e-123");
                        const updated = { ...ws, ...data };
                        mockDbState.workspaces.set("ws-e2e-123", updated);
                        return [updated];
                    }),
                })),
            })),
        })),
        select: vi.fn(() => ({
            from: vi.fn((table) => {
                if (table === "workspaces") {
                    return {
                        where: vi.fn(() => ({
                            limit: vi.fn(() => ({
                                then: vi.fn((resolve) =>
                                    resolve([mockDbState.workspaces.get("ws-e2e-123")]),
                                ),
                            })),
                        })),
                    };
                }
                if (table === "events") {
                    return {
                        where: vi.fn(() => ({
                            orderBy: vi.fn(() => ({
                                limit: vi.fn(() => ({
                                    then: vi.fn((resolve) => {
                                        // Return the last event for hash chaining logic
                                        const last =
                                            mockDbState.events[mockDbState.events.length - 1];
                                        return resolve(last ? [last] : []);
                                    }),
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
                insert: vi.fn((table) => ({
                    values: vi.fn((data) => ({
                        returning: vi.fn().mockImplementation(async () => {
                            if (table === "workspaces") {
                                const id = "ws-e2e-123";
                                const ws = { ...data, id, ownerId: "test-user-id" };
                                mockDbState.workspaces.set(id, ws);
                                return [ws];
                            }
                            return [{}];
                        }),
                    })),
                })),
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

vi.mock("../../db/schema", () => ({
    events: "events",
    workspaces: "workspaces",
    workspaceMembers: "workspace_members",
    users: "users",
}));

vi.mock("../../env", () => ({
    env: {
        get ENCRYPTION_KEY() {
            return "0000000000000000000000000000000000000000000000000000000000000000";
        },
    },
}));

vi.mock("../../lib/token-encryption", () => ({
    encryptToken: vi.fn(async (t) => t), // No-op for e2e test clarity
    decryptToken: vi.fn(async (t) => t),
    generateEncryptionKey: vi.fn(() => "key"),
}));

// ---------------------------------------------------------------------------
// TEST SUITE
// ---------------------------------------------------------------------------

describe("E2E: ShipDocket Workflow (Multi-Provider)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockDbState.workspaces.clear();
        mockDbState.events = [];
    });

    it("should simulate a full user journey: Create Workspace -> Connect Providers -> Process Event", async () => {
        // =========================================================================
        // STEP 1: User Creates a Workspace
        // =========================================================================
        const createRes = await app.request("/workspaces", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer u" },
            body: JSON.stringify({ name: "E2E Corp" }),
        });
        expect(createRes.status).toBe(201);
        const workspace = await createRes.json();
        expect(workspace.id).toBe("ws-e2e-123");
        expect(mockDbState.workspaces.has("ws-e2e-123")).toBe(true);

        // =========================================================================
        // STEP 2 & 3: Connect Providers (Jira & Slack)
        // =========================================================================

        // Mock the generic exchangeCodeForToken for both providers
        vi.spyOn(authService, "exchangeCodeForToken").mockImplementation(async (provider, code) => {
            if (provider === "jira") {
                return {
                    accessToken: "jira-access-token",
                    refreshToken: "jira-refresh-token",
                    expiresIn: 3600,
                    cloudId: "jira-cloud-id",
                };
            }
            if (provider === "slack") {
                return {
                    accessToken: "slack-xoxb-token",
                    teamId: "T-SLACK",
                    teamName: "Slack Team",
                    botUserId: "U-BOT",
                };
            }
            return {} as any;
        });

        // 2. Connect Jira
        await app.request(
            `/auth/jira/callback?code=jira-code&state=${JSON.stringify({ workspaceId: workspace.id })}`,
            {
                method: "GET",
            },
        );

        // Verify Jira data persisted in "DB"
        const wsAfterJira = mockDbState.workspaces.get("ws-e2e-123");
        expect(wsAfterJira.jiraSite).toBe("jira-cloud-id");
        expect(wsAfterJira.jiraAccessToken).toBe("jira-access-token");

        // 3. Connect Slack
        await app.request(
            `/auth/slack/callback?code=slack-code&state=${JSON.stringify({ workspaceId: workspace.id })}`,
            {
                method: "GET",
            },
        );

        // Verify Slack data persisted
        const wsAfterSlack = mockDbState.workspaces.get("ws-e2e-123");
        expect(wsAfterSlack.slackAccessToken).toBe("slack-xoxb-token");

        // =========================================================================
        // STEP 4: Middleware Logic - Event Processing & Chain Integrity
        // =========================================================================
        // Now that both providers are connected, a Jira event should trigger the logic.

        // Mock the "Get Token" helper used by the event handler to verify connection status
        vi.spyOn(authService, "getOAuthToken").mockImplementation(async (wsId, provider) => {
            const ws = mockDbState.workspaces.get(wsId);
            if (provider === "jira") return ws.jiraAccessToken;
            if (provider === "slack") return ws.slackAccessToken;
            return null;
        });

        // Spy on the Slack Notification service to verify the "output" of the middleware
        const slackSpy = vi.spyOn(slackService, "sendHandshakeNotification");

        const jiraEvent = {
            webhookEvent: "jira:issue_updated",
            issue: {
                self: "https://e2e.atlassian.net/rest/api/2/issue/10001",
                key: "E2E-9000",
                fields: {
                    summary: "Final E2E Verification",
                    status: { name: "In Progress" },
                    assignee: { emailAddress: "alice@e2e.com" },
                },
            },
            changelog: {
                items: [{ field: "status", toString: "In Progress", fromString: "To Do" }],
            },
        };

        const webhookRes = await app.request("/webhooks/jira", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jiraEvent),
        });

        expect(webhookRes.status).toBe(200);

        // =========================================================================
        // STEP 5: Verification (The "Middleware Logic")
        // =========================================================================

        // 1. Cross-Provider Notification: Did Jira event trigger Slack message?
        expect(slackSpy).toHaveBeenCalledWith(
            "ws-e2e-123",
            "E2E-9000",
            "Final E2E Verification",
            "alice@e2e.com",
        );

        // 2. Hash Chain Integrity: Was the event chained correctly?
        // The event creation logic (middleware) should have computed a hash based on "genesis" (since it's the first event).
        const storedEvents = mockDbState.events;
        expect(storedEvents.length).toBeGreaterThan(0);
        const lastEvent = storedEvents[storedEvents.length - 1];

        expect(lastEvent.eventType).toBe("handshake");
        expect(lastEvent.prevHash).toBe(null); // First event in the chain (genesis)
        expect(lastEvent.eventHash).toBeDefined();
        expect(lastEvent.eventHash).not.toBe("genesis");

        // Ensure data was captured correctly
        expect(lastEvent.taskId).toBe("E2E-9000");
        expect(lastEvent.payload).toMatchObject({
            status: "In Progress",
        });

        const firstEventHash = lastEvent.eventHash;

        // =========================================================================
        // STEP 5: Verify Hash Chain (Second Event)
        // =========================================================================
        // Trigger a second event to ensure it links to the first one
        const jiraEvent2 = {
            webhookEvent: "jira:issue_updated",
            issue: {
                self: "https://e2e.atlassian.net/rest/api/2/issue/10001",
                key: "E2E-9000",
                fields: {
                    summary: "Final E2E Verification",
                    status: { name: "Done" },
                    assignee: { emailAddress: "alice@e2e.com" },
                },
            },
            changelog: {
                items: [{ field: "status", toString: "Done", fromString: "In Progress" }],
            },
        };

        await app.request("/webhooks/jira", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jiraEvent2),
        });

        const storedEvents2 = mockDbState.events;
        expect(storedEvents2.length).toBe(2);

        const secondEvent = storedEvents2[storedEvents2.length - 1];
        // The second event's prevHash MUST be the first event's hash
        expect(secondEvent.prevHash).toBe(firstEventHash);
        expect(secondEvent.eventHash).not.toBe(firstEventHash);
    });
});
