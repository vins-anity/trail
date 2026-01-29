import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../index";
import * as authService from "../../services/auth.service";

// ---------------------------------------------------------------------------
// MOCKS
// ---------------------------------------------------------------------------

vi.mock("../../middleware/supabase-auth", () => ({
    supabaseAuth: async (c: any, next: any) => {
        c.set("user", { id: "test-user-id", email: "gh-test@example.com" });
        await next();
    },
    optionalAuth: async (c: any, next: any) => {
        c.set("user", { id: "test-user-id", email: "gh-test@example.com" });
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
                        const id = "ws-gh-123";
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
                findFirst: vi.fn(),
            },
            users: {
                findFirst: vi.fn().mockResolvedValue({ id: "test-user-id" }),
            },
        },
        update: vi.fn(() => ({
            set: vi.fn((data) => ({
                where: vi.fn(() => ({
                    returning: vi.fn().mockImplementation(async () => {
                        const ws = mockDb.workspaces.get("ws-gh-123");
                        const updated = { ...ws, ...data };
                        mockDb.workspaces.set("ws-gh-123", updated);
                        return [updated];
                    }),
                })),
            })),
        })),
        select: vi.fn(() => ({
            from: vi.fn((table) => ({
                where: vi.fn(() => ({
                    limit: vi.fn(() => ({
                        then: vi.fn((resolve) => resolve([mockDb.workspaces.get("ws-gh-123")])),
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
        storeOAuthToken: vi.fn(), // Spy on this
    };
});

describe("Integration: GitHub Flow", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockDb.workspaces.clear();

        // Setup initial workspace
        mockDb.workspaces.set("ws-gh-123", {
            id: "ws-gh-123",
            name: "GitHub Test Corp",
            ownerId: "test-user-id",
        });
    });

    it("should redirect to GitHub authorize URL", async () => {
        vi.spyOn(authService, "getAuthorizationUrl").mockReturnValue(
            "https://github.com/login/oauth/authorize?client_id=gh-123",
        );

        const res = await app.request("/auth/github/authorize?workspace_id=ws-gh-123");

        expect(res.status).toBe(302);
        expect(res.headers.get("Location")).toContain("https://github.com/login/oauth/authorize");
        expect(authService.getAuthorizationUrl).toHaveBeenCalledWith(
            "github",
            expect.stringContaining("ws-gh-123"),
            expect.stringContaining("/auth/github/callback"),
        );
    });

    it("should handle GitHub callback and store installation token", async () => {
        // Mock token exchange success
        vi.spyOn(authService, "exchangeCodeForToken").mockResolvedValue({
            accessToken: "gh-installation-token",
            refreshToken: "gh-refresh-token", // GitHub apps might not provide this always, but checking persistence
            expiresIn: 28800,
        });

        // Spy on storage
        const storeSpy = vi.spyOn(authService, "storeOAuthToken");

        const state = JSON.stringify({ workspaceId: "ws-gh-123" });
        const res = await app.request(`/auth/github/callback?code=mock-gh-code&state=${state}`);

        // Should success redirect
        expect(res.status).toBe(302);
        expect(res.headers.get("Location")).toContain("connected=github");

        // Verification: Service called with correct args
        // IMPORTANT: "storeOAuthToken" handles the logic to map this to 'githubInstallationId' internally.
        // We verify that we called the generic storer with "github" provider.
        expect(storeSpy).toHaveBeenCalledWith(
            "ws-gh-123",
            "github",
            "gh-installation-token",
            "gh-refresh-token",
        );
    });
});
