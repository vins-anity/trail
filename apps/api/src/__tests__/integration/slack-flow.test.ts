import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../index";
import * as authService from "../../services/auth.service";

// ---------------------------------------------------------------------------
// MOCKS
// ---------------------------------------------------------------------------

vi.mock("../../middleware/supabase-auth", () => ({
    supabaseAuth: async (c: any, next: any) => {
        c.set("user", { id: "test-user-id", email: "slack-test@example.com" });
        await next();
    },
    optionalAuth: async (c: any, next: any) => {
        c.set("user", { id: "test-user-id", email: "slack-test@example.com" });
        await next();
    },
}));

// Mock Database State
const mockDb = {
    workspaces: new Map<string, any>(),
};

vi.mock("../../db", () => ({
    db: {
        insert: vi.fn((table) => ({
            values: vi.fn((data) => ({
                returning: vi.fn().mockImplementation(async () => {
                    if (table === "workspaces") {
                        const id = "ws-slack-123";
                        const ws = { ...data, id, ownerId: "test-user-id" };
                        mockDb.workspaces.set(id, ws);
                        return [ws];
                    }
                    return [{}];
                }),
            })),
        })),
        query: {
            workspaces: {
                findFirst: vi.fn(), // Not used in this direct flow usually, unless validation check
            },
            users: {
                findFirst: vi.fn().mockResolvedValue({ id: "test-user-id" }),
            },
        },
        update: vi.fn(() => ({
            set: vi.fn((data) => ({
                where: vi.fn(() => ({
                    returning: vi.fn().mockImplementation(async () => {
                        // In real app, `where` would resolve the ID, here we assume it matches
                        const ws = mockDb.workspaces.get("ws-slack-123");
                        const updated = { ...ws, ...data };
                        mockDb.workspaces.set("ws-slack-123", updated);
                        return [updated];
                    }),
                })),
            })),
        })),
        select: vi.fn(() => ({
            from: vi.fn((table) => ({
                where: vi.fn(() => ({
                    limit: vi.fn(() => ({
                        then: vi.fn((resolve) => resolve([mockDb.workspaces.get("ws-slack-123")])),
                    })),
                })),
            })),
        })),
    },
    schema: { workspaces: "workspaces" },
}));

vi.mock("../../services/auth.service", async () => {
    const actual = await vi.importActual("../../services/auth.service");
    return {
        ...actual,
        getAuthorizationUrl: vi.fn(),
        exchangeCodeForToken: vi.fn(),
        storeOAuthToken: vi.fn(), // Spy on this to verify logic
    };
});

describe("Integration: Slack Flow", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockDb.workspaces.clear();

        // Setup initial workspace
        mockDb.workspaces.set("ws-slack-123", {
            id: "ws-slack-123",
            name: "Slack Test Corp",
            ownerId: "test-user-id",
        });
    });

    it("should redirect to Slack authorize URL", async () => {
        vi.spyOn(authService, "getAuthorizationUrl").mockReturnValue(
            "https://slack.com/oauth/mock?client_id=123",
        );

        const res = await app.request("/auth/slack/authorize?workspace_id=ws-slack-123");

        expect(res.status).toBe(302);
        expect(res.headers.get("Location")).toContain("https://slack.com/oauth/mock");
        expect(authService.getAuthorizationUrl).toHaveBeenCalledWith(
            "slack",
            expect.stringContaining("ws-slack-123"), // State should contain workspace ID
            expect.stringContaining("/auth/slack/callback"),
        );
    });

    it("should handle Slack callback and store token", async () => {
        // Mock token exchange success
        vi.spyOn(authService, "exchangeCodeForToken").mockResolvedValue({
            accessToken: "xoxb-mock-token",
            refreshToken: "mock-refresh",
            expiresIn: 3600,
        });

        // Spy on storage
        const storeSpy = vi.spyOn(authService, "storeOAuthToken");

        const state = JSON.stringify({ workspaceId: "ws-slack-123" });
        const res = await app.request(`/auth/slack/callback?code=mock-code&state=${state}`);

        // Should success redirect
        expect(res.status).toBe(302);
        expect(res.headers.get("Location")).toContain("connected=slack");

        // Verification: Service called with correct args
        expect(storeSpy).toHaveBeenCalledWith(
            "ws-slack-123",
            "slack",
            "xoxb-mock-token",
            "mock-refresh",
            3600,
        );
    });

    it("should reject callback with missing params", async () => {
        const res = await app.request("/auth/slack/callback"); // No code/state
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "Invalid OAuth callback" });
    });
});
