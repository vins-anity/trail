import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

// ==========================================
// Types
// ==========================================

export interface JiraAnalysis {
    detectedType: "kanban" | "scrum" | "project_management" | "unknown";
    confidence: number;
    suggestedConfig: {
        startTracking: string[];
        reviewStatus: string[];
        doneStatus: string[];
        excludedTaskTypes: string[];
        policyTier: "agile" | "standard" | "hardened";
    };
    raw: {
        projects: any[];
        boards: any[];
        statuses: any[];
    };
}

export interface GitHubAnalysis {
    repos: any[];
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
// Hooks
// ==========================================

export function useJiraAnalysis(workspaceId: string, enabled: boolean) {
    return useQuery({
        queryKey: ["onboarding", "analyze", "jira", workspaceId],
        queryFn: async () => {
            const res = await api.post(`/onboarding/${workspaceId}/analyze/jira`);
            return res.data as JiraAnalysis;
        },
        enabled: enabled && !!workspaceId,
        staleTime: 10 * 60 * 1000, // Cache for 10 mins
        retry: 1,
    });
}

export function useGitHubAnalysis(workspaceId: string, enabled: boolean) {
    return useQuery({
        queryKey: ["onboarding", "analyze", "github", workspaceId],
        queryFn: async () => {
            const res = await api.post(`/onboarding/${workspaceId}/analyze/github`);
            return res.data as GitHubAnalysis;
        },
        enabled: enabled && !!workspaceId,
        staleTime: 10 * 60 * 1000, // Cache for 10 mins
        retry: 1,
    });
}
