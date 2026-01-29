import { Octokit } from "@octokit/rest";
import { env } from "../env";

export class GitHubService {
    private octokit: Octokit;

    constructor(auth?: string) {
        // Auth token is optional for public repos but recommended for rate limits
        this.octokit = new Octokit({
            auth: auth || env.GITHUB_CLIENT_ID, // Use a generic token if available
        });
    }

    /**
     * Fetch Pull Request details including title, body, state, and labels
     */
    async fetchPRDetails(owner: string, repo: string, prNumber: number) {
        try {
            const { data } = await this.octokit.pulls.get({
                owner,
                repo,
                pull_number: prNumber,
            });

            return {
                title: data.title,
                body: data.body,
                state: data.state,
                merged: data.merged,
                author: data.user.login,
                labels: data.labels.map((l) => l.name),
                createdAt: data.created_at,
                mergedAt: data.merged_at,
            };
        } catch (error) {
            console.error(`[GitHub] Failed to fetch PR #${prNumber}:`, error);
            throw new Error(
                `Failed to fetch PR details: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Fetch recent commits from a Pull Request
     */
    async fetchCommits(owner: string, repo: string, prNumber: number) {
        try {
            const { data } = await this.octokit.pulls.listCommits({
                owner,
                repo,
                pull_number: prNumber,
                per_page: 50, // Reasonable limit for AI context
            });

            return data.map((commit) => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author?.name || commit.author?.login || "Unknown",
                date: commit.commit.author?.date,
            }));
        } catch (error) {
            console.error(`[GitHub] Failed to fetch commits for PR #${prNumber}:`, error);
            throw new Error(
                `Failed to fetch commits: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}

export const githubService = new GitHubService();
