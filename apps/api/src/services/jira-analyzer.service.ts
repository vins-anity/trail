import { jiraService } from "./jira.service";

// ==========================================
// Types
// ==========================================

export interface JiraProject {
    id: string;
    key: string;
    name: string;
    projectTypeKey: string; // 'software', 'service_desk', 'business'
    simplified: boolean;
    style: "classic" | "next-gen";
}

export interface JiraBoard {
    id: number;
    name: string;
    type: "scrum" | "kanban" | "simple";
    location?: {
        projectId: number;
        projectKey: string;
        projectName: string;
    };
}

export interface JiraStatus {
    id: string;
    name: string;
    statusCategory: {
        id: number;
        key: string; // 'new', 'indeterminate', 'done'
        colorName: string;
        name: string;
    };
}

export interface JiraIssueType {
    id: string;
    description: string;
    iconUrl: string;
    name: string;
    subtask: boolean;
    hierarchyLevel: number; // 0=subtask, 1=standard, 2=epic
}

export interface WorkflowAnalysis {
    detectedType: "kanban" | "scrum" | "project_management" | "unknown";
    confidence: number; // 0-100
    suggestedConfig: {
        startTracking: string[];
        reviewStatus: string[];
        doneStatus: string[];
        excludedTaskTypes: string[];
        policyTier: "agile" | "standard" | "hardened";
    };
    raw: {
        projects: JiraProject[];
        boards: JiraBoard[];
        statuses: JiraStatus[];
        issueTypes: JiraIssueType[];
    };
}

// ==========================================
// Service
// ==========================================

export class JiraAnalyzerService {
    /**
     * Analyze a Jira workspace to detect workflow patterns
     */
    async analyzeWorkspace(cloudId: string, accessToken: string): Promise<WorkflowAnalysis> {
        // 1. Fetch all necessary data in parallel
        const [projects, boards, statuses, issueTypes] = await Promise.all([
            this.fetchProjects(cloudId, accessToken),
            this.fetchBoards(cloudId, accessToken),
            this.fetchStatuses(cloudId, accessToken),
            this.fetchIssueTypes(cloudId, accessToken),
        ]);

        // 2. Analyze board types (Strongest signal)
        const hasScrumBoard = boards.some((b) => b.type === "scrum");
        const hasKanbanBoard = boards.some((b) => b.type === "kanban");

        // 3. Analyze Issue Types (Secondary signal)
        const hasEpics = issueTypes.some((it) => it.name.toLowerCase() === "epic");
        const hasStories = issueTypes.some((it) => it.name.toLowerCase() === "story");

        // 4. Determine Workflow Type
        let detectedType: WorkflowAnalysis["detectedType"] = "unknown";
        let confidence = 0;

        if (hasScrumBoard) {
            detectedType = "scrum";
            confidence = hasStories ? 90 : 80;
        } else if (hasKanbanBoard) {
            detectedType = "kanban";
            confidence = 85;
        } else if (projects.some((p) => p.projectTypeKey === "software")) {
            // Software project but no explicit board found (e.g. simplified workflow)
            detectedType = "project_management";
            confidence = 60;
        } else if (projects.some((p) => p.projectTypeKey === "business")) {
            detectedType = "project_management";
            confidence = 70;
        }

        // 5. Build Status Tables
        const todoStatuses = statuses
            .filter((s) => s.statusCategory.key === "new")
            .map((s) => s.name);

        const inProgressStatuses = statuses
            .filter((s) => s.statusCategory.key === "indeterminate")
            .map((s) => s.name);

        const doneStatuses = statuses
            .filter((s) => s.statusCategory.key === "done")
            .map((s) => s.name);

        // Smart Filtering for "Review" statuses
        // Look for keywords in "In Progress" category
        const reviewKeywords = ["review", "qa", "test", "verify", "staging"];
        const detectedReviewStatuses = inProgressStatuses.filter((s) =>
            reviewKeywords.some((k) => s.toLowerCase().includes(k)),
        );

        // Remove detected review statuses from tracking list to avoid duplication
        const trackingStatuses = inProgressStatuses.filter(
            (s) => !detectedReviewStatuses.includes(s),
        );

        // 6. Generate Suggested Configuration
        const suggestedConfig: WorkflowAnalysis["suggestedConfig"] = {
            startTracking: trackingStatuses,
            reviewStatus: detectedReviewStatuses.length > 0 ? detectedReviewStatuses : [],
            doneStatus: doneStatuses,
            excludedTaskTypes: issueTypes.filter(it => it.subtask).map(it => it.name),
            policyTier: "standard",
        };

        // Refine based on type
        if (detectedType === "kanban") {
            suggestedConfig.policyTier = "agile";
            // Ensure we have at least 'In Progress' if list is empty
            if (suggestedConfig.startTracking.length === 0) {
                suggestedConfig.startTracking.push("In Progress");
            }
        } else if (detectedType === "scrum") {
            suggestedConfig.policyTier = "standard";
            if (suggestedConfig.reviewStatus.length === 0) {
                suggestedConfig.reviewStatus.push("In Review");
            }
        } else if (detectedType === "project_management") {
            suggestedConfig.policyTier = "standard";
            suggestedConfig.startTracking = ["In Progress", "Active"];
            suggestedConfig.doneStatus = ["Done", "Closed", "Complete"];
        }

        return {
            detectedType,
            confidence,
            suggestedConfig,
            raw: { projects, boards, statuses, issueTypes },
        };
    }

    // ==========================================
    // Data Fetching Helpers
    // ==========================================

    private async fetchProjects(cloudId: string, accessToken: string): Promise<JiraProject[]> {
        try {
            return await jiraService.callJiraAPI<JiraProject[]>(
                cloudId,
                accessToken,
                "/rest/api/3/project",
            );
        } catch (e) {
            console.warn("[JiraAnalyzer] Failed to fetch projects", e);
            return [];
        }
    }

    private async fetchBoards(cloudId: string, accessToken: string): Promise<JiraBoard[]> {
        try {
            const data = await jiraService.callJiraAPI<{ values: JiraBoard[] }>(
                cloudId,
                accessToken,
                "/rest/agile/1.0/board",
            );
            return data.values;
        } catch (e) {
            console.warn("[JiraAnalyzer] Failed to fetch boards", e);
            return [];
        }
    }

    private async fetchStatuses(cloudId: string, accessToken: string): Promise<JiraStatus[]> {
        try {
            return await jiraService.callJiraAPI<JiraStatus[]>(
                cloudId,
                accessToken,
                "/rest/api/3/status",
            );
        } catch (e) {
            console.warn("[JiraAnalyzer] Failed to fetch statuses", e);
            return [];
        }
    }

    private async fetchIssueTypes(cloudId: string, accessToken: string): Promise<JiraIssueType[]> {
        try {
            return await jiraService.callJiraAPI<JiraIssueType[]>(
                cloudId,
                accessToken,
                "/rest/api/3/issuetype",
            );
        } catch (e) {
            console.warn("[JiraAnalyzer] Failed to fetch issue types", e);
            return [];
        }
    }
}

export const jiraAnalyzerService = new JiraAnalyzerService();
