import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as authService from "../services/auth.service";
import { JiraService } from "../services/jira.service";
import * as workspacesService from "../services/workspaces.service";

// Mock dependencies
vi.mock("../services/auth.service");
vi.mock("../services/workspaces.service");

// Mock env to respect process.env changes
vi.mock("../env", () => ({
    env: {
        get JIRA_HOST() {
            return process.env.JIRA_HOST;
        },
        get JIRA_EMAIL() {
            return process.env.JIRA_EMAIL;
        },
        get JIRA_API_TOKEN() {
            return process.env.JIRA_API_TOKEN;
        },
    },
}));

// Use spyOn to allow implementation changes and avoid global type mismatches
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe("Jira Service", () => {
    let service: JiraService;
    const originalEnv = process.env;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env = {
            ...originalEnv,
            JIRA_HOST: "test.atlassian.net",
            JIRA_EMAIL: "user@test.com",
            JIRA_API_TOKEN: "token",
        };
        service = new JiraService();

        // Default: No OAuth token
        vi.mocked(authService.getOAuthToken).mockResolvedValue(null);
        vi.mocked(workspacesService.getWorkspaceById).mockResolvedValue(null);
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe("syncTaskStatus", () => {
        it("should sync status if transition exists (Basic Auth)", async () => {
            // Mock transitions response
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    transitions: [{ id: "101", name: "Done" }],
                }),
            });

            // Mock update response
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({}), // Return empty object for success
                status: 204,
            });

            await service.syncTaskStatus("workspace-123", "TRAIL-123", "Done");

            // Verify fetching transitions
            expect(mockFetch).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining("/issue/TRAIL-123/transitions"),
                expect.objectContaining({ method: "GET" }),
            );

            // Verify posting transition
            expect(mockFetch).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining("/issue/TRAIL-123/transitions"),
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ transition: { id: "101" } }),
                }),
            );
        });

        it("should sync status using OAuth if token exists", async () => {
            // Mock OAuth token & Workspace
            vi.mocked(authService.getOAuthToken).mockResolvedValue("access-token-123");
            vi.mocked(workspacesService.getWorkspaceById).mockResolvedValue({
                id: "workspace-123",
                jiraSite: "cloud-id-123",
            } as any);

            // Mock transitions response
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    transitions: [{ id: "101", name: "Done" }],
                }),
            });

            // Mock update response
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
                status: 204,
            });

            await service.syncTaskStatus("workspace-123", "TRAIL-123", "Done");

            // Verify fetching transitions with Cloud ID
            expect(mockFetch).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining(
                    "https://api.atlassian.com/ex/jira/cloud-id-123/rest/api/3/issue/TRAIL-123/transitions",
                ),
                expect.objectContaining({
                    method: "GET",
                    headers: expect.objectContaining({
                        Authorization: "Bearer access-token-123",
                    }),
                }),
            );

            // Verify posting transition
            expect(mockFetch).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining(
                    "https://api.atlassian.com/ex/jira/cloud-id-123/rest/api/3/issue/TRAIL-123/transitions",
                ),
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ transition: { id: "101" } }),
                }),
            );
        });

        it("should log warning if transition not found", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    transitions: [{ id: "101", name: "In Progress" }],
                }),
            });

            const consoleSpy = vi.spyOn(console, "warn");
            await service.syncTaskStatus("workspace-123", "TRAIL-123", "Done");

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Transition to "Done" not found'),
            );
            expect(mockFetch).toBeCalledTimes(1); // Should not try to update
        });

        it("should gracefully handle API errors", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                statusText: "Unauthorized",
            });

            const consoleSpy = vi.spyOn(console, "error");
            await service.syncTaskStatus("workspace-123", "TRAIL-123", "Done");

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Failed to sync status"),
                expect.anything(),
            );
        });
    });
});
