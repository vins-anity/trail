import { env } from "../env";
import { getOAuthToken } from "./auth.service";
import * as workspacesService from "./workspaces.service";

export class JiraService {
    private baseUrl: string;
    private email: string;
    private apiToken: string;

    constructor() {
        this.baseUrl = env.JIRA_HOST || "";
        this.email = env.JIRA_EMAIL || "";
        this.apiToken = env.JIRA_API_TOKEN || "";
    }

    /**
     * Transition a Jira issue to a new status
     */
    async syncTaskStatus(workspaceId: string, taskId: string, status: string) {
        // Try OAuth first
        const oauthToken = await getOAuthToken(workspaceId, "jira");
        const workspace = await workspacesService.getWorkspaceById(workspaceId);
        const cloudId = workspace?.jiraSite;

        if (oauthToken && cloudId) {
            try {
                await this.performTransitionOAuth(cloudId, oauthToken, taskId, status);
                return;
            } catch (error) {
                console.warn("[Jira] OAuth sync failed, falling back to Basic Auth:", error);
            }
        }

        // Fallback to Basic Auth
        if (!this.baseUrl || !this.email || !this.apiToken) {
            console.warn("[Jira] Credentials missing (OAuth & Basic), skipping status sync");
            return;
        }

        await this.performTransitionBasic(taskId, status);
    }

    // ... (Existing Basic Auth Logic moved to private method)
    private async performTransitionBasic(taskId: string, status: string) {
        try {
            // 1. Get available transitions
            const transitionsResponse = await fetch(
                `https://${this.baseUrl}/rest/api/3/issue/${taskId}/transitions`,
                {
                    method: "GET",
                    headers: this.getHeaders(),
                },
            );

            if (!transitionsResponse.ok) {
                throw new Error(`Failed to get transitions: ${transitionsResponse.statusText}`);
            }

            const transitionsData = await transitionsResponse.json();
            const transition = transitionsData.transitions.find(
                (t: { name: string; id: string }) => t.name.toLowerCase() === status.toLowerCase(),
            );

            if (!transition) {
                console.warn(`[Jira] Transition to "${status}" not found for ${taskId}`);
                return;
            }

            // 2. Perform transition
            const updateResponse = await fetch(
                `https://${this.baseUrl}/rest/api/3/issue/${taskId}/transitions`,
                {
                    method: "POST",
                    headers: this.getHeaders(),
                    body: JSON.stringify({
                        transition: { id: transition.id },
                    }),
                },
            );

            if (!updateResponse.ok) {
                throw new Error(`Failed to update status: ${updateResponse.statusText}`);
            }

            console.log(`[Jira] Synced status for ${taskId} to "${status}" (Basic Auth)`);
        } catch (error) {
            console.error(`[Jira] Failed to sync status for ${taskId}:`, error);
        }
    }

    private async performTransitionOAuth(
        cloudId: string,
        accessToken: string,
        taskId: string,
        status: string,
    ) {
        // 1. Get available transitions (OAuth)
        const transitionsResponse = await fetch(
            `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${taskId}/transitions`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                },
            },
        );

        if (!transitionsResponse.ok) {
            throw new Error(`Failed to get transitions: ${transitionsResponse.statusText}`);
        }

        const transitionsData = await transitionsResponse.json();
        const transition = transitionsData.transitions.find(
            (t: { name: string; id: string }) => t.name.toLowerCase() === status.toLowerCase(),
        );

        if (!transition) {
            console.warn(`[Jira] Transition to "${status}" not found for ${taskId}`);
            return;
        }

        // 2. Perform transition (OAuth)
        const updateResponse = await fetch(
            `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${taskId}/transitions`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transition: { id: transition.id },
                }),
            },
        );

        if (!updateResponse.ok) {
            throw new Error(`Failed to update status: ${updateResponse.statusText}`);
        }

        console.log(`[Jira] Synced status for ${taskId} to "${status}" (OAuth)`);
    }

    private getHeaders() {
        const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString("base64");
        return {
            Authorization: `Basic ${auth}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        };
    }

    /**
     * Make an authenticated request to Jira Cloud API
     */
    async callJiraAPI<T>(cloudId: string, accessToken: string, endpoint: string): Promise<T> {
        const response = await fetch(`https://api.atlassian.com/ex/jira/${cloudId}${endpoint}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Jira API error [${response.status}]: ${response.statusText}`);
        }

        return response.json();
    }
}

export const jiraService = new JiraService();
