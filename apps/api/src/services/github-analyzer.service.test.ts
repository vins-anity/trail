import { beforeEach, describe, expect, it, vi } from "vitest";
import { GitHubAnalyzerService } from "./github-analyzer.service";

// Mock Octokit
const mockListRepoWorkflows = vi.fn();
const mockListForAuthenticatedUser = vi.fn();

vi.mock("@octokit/rest", () => ({
    Octokit: class {
        static plugin() {
            return this;
        }
        constructor(options: any) { }
        actions = {
            listRepoWorkflows: mockListRepoWorkflows,
        };
        repos = {
            listForAuthenticatedUser: mockListForAuthenticatedUser,
            getContent: vi.fn(), // Add for completeness since valid code uses it
        };
        log = {
            warn: vi.fn(),
            info: vi.fn(),
        };
    },
}));

describe("GitHubAnalyzerService", () => {
    let service: GitHubAnalyzerService;

    beforeEach(() => {
        service = new GitHubAnalyzerService();
        vi.clearAllMocks();
    });

    it("should detect GitHub Actions when workflows exist", async () => {
        // Mock Repos
        mockListForAuthenticatedUser.mockResolvedValue({
            data: [
                {
                    id: 1,
                    name: "repo-1",
                    full_name: "owner/repo-1",
                    private: true,
                    html_url: "...",
                    default_branch: "main",
                },
            ],
        });

        // Mock Workflows
        mockListRepoWorkflows.mockResolvedValue({
            data: {
                total_count: 1,
                workflows: [{ name: "CI" }],
            },
        });

        const result = await service.analyzeWorkspace("token");

        expect(result.cicdSummary.reposWithCI).toBe(1);
        expect(result.cicdSummary.primaryCIProvider).toBe("github_actions");
        expect(result.suggestedConfig.requireCiPass).toBe(true);
    });

    it("should detect No CI when no workflows exist", async () => {
        mockListForAuthenticatedUser.mockResolvedValue({
            data: [{ id: 1, name: "repo-1", full_name: "owner/repo-1", private: true }],
        });

        mockListRepoWorkflows.mockResolvedValue({
            data: {
                total_count: 0,
                workflows: [],
            },
        });

        const result = await service.analyzeWorkspace("token");

        expect(result.cicdSummary.reposWithCI).toBe(0);
        expect(result.cicdSummary.primaryCIProvider).toBe("none");
        expect(result.suggestedConfig.requireCiPass).toBe(false);
    });

    it("should handle API errors gracefully", async () => {
        mockListForAuthenticatedUser.mockRejectedValue(new Error("API Error"));

        const result = await service.analyzeWorkspace("token");

        expect(result.repos).toEqual([]);
        expect(result.cicdSummary.totalRepos).toBe(0);
    });
});
