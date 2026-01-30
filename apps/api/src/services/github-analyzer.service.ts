import { Octokit } from "@octokit/rest";

// ==========================================
// Types
// ==========================================

export interface GitHubRepo {
    id: number;
    name: string;
    fullName: string; // owner/repo
    private: boolean;
    htmlUrl: string;
    defaultBranch: string;
    updatedAt: string | null;
}

export interface CICDAnalysis {
    hasCICD: boolean;
    provider: "github_actions" | "circleci" | "jenkins" | "none";
    workflows: string[]; // Workflow file names
    lastRunStatus?: "success" | "failure" | "pending";
}

export interface GitHubAnalysis {
    repos: GitHubRepo[];
    cicdSummary: {
        reposWithCI: number;
        totalRepos: number;
        primaryCIProvider: string;
    };
    suggestedConfig: {
        requireCiPass: boolean;
        requireAllChecksPass: boolean;
    };
}

// ==========================================
// Service
// ==========================================

export class GitHubAnalyzerService {
    /**
     * Analyze a GitHub workspace to list repos and detect CI/CD
     */
    async analyzeWorkspace(accessToken: string): Promise<GitHubAnalysis> {
        // 1. Fetch user repos
        const repos = await this.listUserRepos(accessToken);

        // 2. Check for CI/CD on recent/active repos (limit to top 5 to avoid rate limits)
        const recentRepos = repos.slice(0, 5);
        let reposWithCI = 0;
        let detectedActions = false;

        // Run checks in parallel
        const checks = await Promise.all(
            recentRepos.map((repo) => {
                const parts = repo.fullName.split("/");
                if (parts.length < 2) return { hasCICD: false, provider: "none", workflows: [] } as CICDAnalysis;
                const owner = parts[0] as string;
                const name = parts[1] as string;
                return this.detectCICD(accessToken, owner, name);
            }),
        );

        checks.forEach((check) => {
            if (check.hasCICD) {
                reposWithCI++;
                if (check.provider === "github_actions") detectedActions = true;
            }
        });

        // 3. Generate Suggested Configuration
        const suggestedConfig = {
            requireCiPass: reposWithCI > 0,
            requireAllChecksPass: detectedActions, // Stricter if Actions is used
        };

        return {
            repos,
            cicdSummary: {
                reposWithCI,
                totalRepos: repos.length,
                primaryCIProvider: detectedActions ? "github_actions" : "none",
            },
            suggestedConfig,
        };
    }

    /**
     * List repositories visible to the user
     */
    async listUserRepos(accessToken: string): Promise<GitHubRepo[]> {
        const octokit = new Octokit({ auth: accessToken });
        try {
            const { data } = await octokit.repos.listForAuthenticatedUser({
                per_page: 100,
                sort: "updated",
                type: "all",
            });

            return data.map((repo) => ({
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                private: repo.private,
                htmlUrl: repo.html_url,
                defaultBranch: repo.default_branch,
                updatedAt: repo.updated_at ?? null,
            }));
        } catch (error) {
            console.error("[GitHubAnalyzer] Failed to list repos:", error);
            return [];
        }
    }

    /**
     * Detect CI/CD configuration for a specific repo
     */
    async detectCICD(
        accessToken: string,
        owner: string,
        repo: string,
    ): Promise<CICDAnalysis> {
        const octokit = new Octokit({ auth: accessToken });

        // Check for GitHub Actions Workflows
        try {
            // Requires 'actions:read' or checking file existence if scope not available
            const { data } = await octokit.actions.listRepoWorkflows({
                owner,
                repo,
            });

            if (data.total_count > 0) {
                return {
                    hasCICD: true,
                    provider: "github_actions",
                    workflows: data.workflows.map((w) => w.name),
                };
            }
        } catch (error) {
            // Fallback: Check for common config files if API fails (e.g. scopes issue)
            // This is "passive" detection via file presence
        }

        // TODO: Add CircleCI/Jenkins detection via file existence check if needed
        // For now, assume no CI if Actions check fails

        return {
            hasCICD: false,
            provider: "none",
            workflows: [],
        };
    }
}

export const githubAnalyzerService = new GitHubAnalyzerService();
