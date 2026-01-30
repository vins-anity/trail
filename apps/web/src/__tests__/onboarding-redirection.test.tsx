import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OnboardingWidget } from "../components/onboarding/OnboardingWidget";
import { DashboardPage } from "../pages/dashboard/index";
import { useWorkspaceStatus } from "../hooks/use-workspace-status";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { useEvents } from "../hooks/use-events";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { toast } from "sonner";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

// Mocks
vi.mock("@tanstack/react-query", async (importActual) => {
    const actual = await importActual<typeof import("@tanstack/react-query")>();
    return {
        ...actual,
        useQueryClient: vi.fn(),
    };
});

vi.mock("@/hooks/use-workspace-status", () => ({
    useWorkspaceStatus: vi.fn(),
}));

vi.mock("@/hooks/use-dashboard-stats", () => ({
    useDashboardStats: vi.fn(),
}));

vi.mock("@/hooks/use-events", () => ({
    useEvents: vi.fn(),
}));

vi.mock("@/components/auth/AuthProvider", () => ({
    useAuth: () => ({ session: { access_token: "fake-token" } }),
}));

vi.mock("@/lib/api", () => ({
    api: {
        workspaces: {
            update: vi.fn(),
        },
    },
}));

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("Onboarding Redirection Logic", () => {
    const mockInvalidateQueries = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useQueryClient as any).mockReturnValue({
            invalidateQueries: mockInvalidateQueries,
        });
        // Default mock implementation for stats and events to avoid breakage
        (useDashboardStats as any).mockReturnValue({
            stats: {
                activeTasks: 10,
                completedTasks: 5,
                handshakeRate: 85,
                avgClosureTime: 2.5,
            },
            isLoading: false
        });
        (useEvents as any).mockReturnValue({ data: [], isLoading: false });
    });

    it("should calculate progress correctly and show 'Launch Dashboard' when complete", async () => {
        (useWorkspaceStatus as any).mockReturnValue({
            data: {
                id: "ws-123",
                hasJira: true,
                hasGithub: true,
                hasSlack: true,
                workflowSettings: { stack: ["jira", "github", "slack"] },
                onboardingCompletedAt: null,
            },
            isLoading: false,
        });

        render(<OnboardingWidget workspaceId="ws-123" />);

        expect(await screen.findByText(/ShipDocket is Ready to Launch/i)).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: /Launch Dashboard/i })).toBeInTheDocument();
        expect(await screen.findByText(/100%/i)).toBeInTheDocument();
    });

    it("should show 'Setup Required' and connection cards when incomplete", async () => {
        (useWorkspaceStatus as any).mockReturnValue({
            data: {
                id: "ws-123",
                hasJira: false,
                hasGithub: false,
                hasSlack: false,
                workflowSettings: { stack: ["jira", "github", "slack"] },
                onboardingCompletedAt: null,
            },
            isLoading: false,
        });

        render(<OnboardingWidget workspaceId="ws-123" />);

        // screen.debug();

        expect(await screen.findByRole("heading", { name: /Initialize Your Workspace/i })).toBeInTheDocument();
        expect(await screen.findByText(/Step 1 of 4/i)).toBeInTheDocument();
        expect(screen.queryByText(/Launch Dashboard/i)).not.toBeInTheDocument();
        expect(await screen.findByRole("button", { name: /Connect Jira/i })).toBeInTheDocument();
    });

    it("should call api.workspaces.update and invalidateQueries on launch", async () => {
        const mockUpdate = vi.fn().mockResolvedValue({});
        (api.workspaces.update as any) = mockUpdate;

        (useWorkspaceStatus as any).mockReturnValue({
            data: {
                id: "ws-123",
                hasJira: true,
                hasGithub: true,
                hasSlack: true,
                workflowSettings: { stack: ["jira", "github", "slack"] },
                onboardingCompletedAt: null,
            },
            isLoading: false,
        });

        render(<OnboardingWidget workspaceId="ws-123" />);

        const launchButton = await screen.findByRole("button", { name: /Launch Dashboard/i });
        fireEvent.click(launchButton);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith("ws-123", expect.objectContaining({
                onboardingCompletedAt: expect.any(String),
            }));
        });

        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["workspace-status"] });
        expect(toast.success).toHaveBeenCalledWith("Launch sequence successful!");
    });

    it("should show error toast if launch fails", async () => {
        (useWorkspaceStatus as any).mockReturnValue({
            data: {
                id: "ws-123",
                hasJira: true,
                hasGithub: true,
                hasSlack: true,
                workflowSettings: { stack: ["jira", "github", "slack"] },
                onboardingCompletedAt: null,
            },
            isLoading: false,
        });

        (api.workspaces.update as any).mockRejectedValueOnce(new Error("Network Error"));

        render(<OnboardingWidget workspaceId="ws-123" />);

        const launchButton = screen.getByText(/Launch Dashboard/i);
        fireEvent.click(launchButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to launch dashboard. Please try again.");
        });

        expect(mockInvalidateQueries).not.toHaveBeenCalled();
    });
});

describe("Dashboard Page Redirection Logic", () => {
    it("should show OnboardingWidget if not fully onboarded", async () => {
        (useWorkspaceStatus as any).mockReturnValue({
            data: {
                id: "ws-123",
                hasJira: true,
                hasGithub: true,
                hasSlack: true,
                workflowSettings: { stack: ["jira", "github", "slack"] },
                onboardingCompletedAt: null,
            },
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={["/dashboard?workspace_id=ws-123"]}>
                <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText(/ShipDocket is Ready to Launch/i)).toBeInTheDocument();
    });

    it("should show full dashboard if onboarded", async () => {
        (useWorkspaceStatus as any).mockReturnValue({
            data: {
                id: "ws-123",
                hasJira: true,
                hasGithub: true,
                hasSlack: true,
                workflowSettings: { stack: ["jira", "github", "slack"] },
                onboardingCompletedAt: new Date().toISOString(),
            },
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={["/dashboard?workspace_id=ws-123"]}>
                <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText(/Overview of your delivery assurance metrics/i)).toBeInTheDocument();
        expect(screen.queryByText(/Launch Dashboard/i)).not.toBeInTheDocument();
    });
});
