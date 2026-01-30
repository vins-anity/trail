import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JiraAnalyzerService } from './jira-analyzer.service';
import { jiraService } from './jira.service';

// Mock dependencies
vi.mock('./jira.service', () => ({
    jiraService: {
        callJiraAPI: vi.fn(),
    },
}));

describe('JiraAnalyzerService', () => {
    let service: JiraAnalyzerService;

    beforeEach(() => {
        service = new JiraAnalyzerService();
        vi.clearAllMocks();
    });

    it('should detect Kanban workflow when kanban board is present', async () => {
        // Setup Mocks
        (jiraService.callJiraAPI as any).mockImplementation((_cloudId: string, _token: string, endpoint: string) => {
            if (endpoint.includes('/project')) return Promise.resolve([{ projectTypeKey: 'software' }]);
            if (endpoint.includes('/board')) return Promise.resolve({ values: [{ type: 'kanban', name: 'Kanban Board' }] });
            if (endpoint.includes('/status')) return Promise.resolve([
                { name: 'Backlog', statusCategory: { key: 'new' } },
                { name: 'In Progress', statusCategory: { key: 'indeterminate' } },
                { name: 'Done', statusCategory: { key: 'done' } }
            ]);
            if (endpoint.includes('/issuetype')) return Promise.resolve([{ name: 'Task', subtask: false }]);
            return Promise.resolve([]);
        });

        const result = await service.analyzeWorkspace('cloud-id', 'token');

        expect(result.detectedType).toBe('kanban');
        expect(result.confidence).toBe(85);
        expect(result.suggestedConfig.policyTier).toBe('agile');
    });

    it('should detect Scrum workflow when scrum board is present', async () => {
        // Setup Mocks
        (jiraService.callJiraAPI as any).mockImplementation((_cloudId: string, _token: string, endpoint: string) => {
            if (endpoint.includes('/project')) return Promise.resolve([{ projectTypeKey: 'software' }]);
            if (endpoint.includes('/board')) return Promise.resolve({ values: [{ type: 'scrum', name: 'Scrum Board' }] });
            if (endpoint.includes('/status')) return Promise.resolve([
                { name: 'To Do', statusCategory: { key: 'new' } },
                { name: 'In Progress', statusCategory: { key: 'indeterminate' } },
                { name: 'Done', statusCategory: { key: 'done' } }
            ]);
            if (endpoint.includes('/issuetype')) return Promise.resolve([{ name: 'Story', subtask: false }]); // Stories boost confidence
            return Promise.resolve([]);
        });

        const result = await service.analyzeWorkspace('cloud-id', 'token');

        expect(result.detectedType).toBe('scrum');
        expect(result.confidence).toBe(90); // 90 because 'Story' is present
        expect(result.suggestedConfig.policyTier).toBe('standard');
    });

    it('should fallback to Project Management if no boards but business project detected', async () => {
        // Setup Mocks
        (jiraService.callJiraAPI as any).mockImplementation((_cloudId: string, _token: string, endpoint: string) => {
            if (endpoint.includes('/project')) return Promise.resolve([{ projectTypeKey: 'business' }]);
            if (endpoint.includes('/board')) return Promise.resolve({ values: [] });
            if (endpoint.includes('/status')) return Promise.resolve([]);
            if (endpoint.includes('/issuetype')) return Promise.resolve([]);
            return Promise.resolve([]);
        });

        const result = await service.analyzeWorkspace('cloud-id', 'token');

        expect(result.detectedType).toBe('project_management');
        expect(result.confidence).toBe(70);
    });

    it('should correctly identify review statuses', async () => {
        // Setup Mocks to return 'In Review' status
        (jiraService.callJiraAPI as any).mockImplementation((_cloudId: string, _token: string, endpoint: string) => {
            if (endpoint.includes('/project')) return Promise.resolve([{ projectTypeKey: 'software' }]);
            if (endpoint.includes('/board')) return Promise.resolve({ values: [{ type: 'kanban' }] });
            if (endpoint.includes('/status')) return Promise.resolve([
                { name: 'In Progress', statusCategory: { key: 'indeterminate' } },
                { name: 'Code Review', statusCategory: { key: 'indeterminate' } }, // Key "indeterminate" but name contains "Review"
                { name: 'Done', statusCategory: { key: 'done' } }
            ]);
            if (endpoint.includes('/issuetype')) return Promise.resolve([]);
            return Promise.resolve([]);
        });

        const result = await service.analyzeWorkspace('cloud-id', 'token');

        expect(result.suggestedConfig.reviewStatus).toContain('Code Review');
        expect(result.suggestedConfig.startTracking).toContain('In Progress');
        expect(result.suggestedConfig.startTracking).not.toContain('Code Review'); // Should stay in review
    });
});
