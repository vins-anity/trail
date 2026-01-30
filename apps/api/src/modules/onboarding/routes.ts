import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/valibot";
import * as v from "valibot";

import * as authService from "../../services/auth.service";
import { githubAnalyzerService } from "../../services/github-analyzer.service";
import { jiraAnalyzerService } from "../../services/jira-analyzer.service";
import * as workspacesService from "../../services/workspaces.service";

/**
 * Onboarding Module - Smart Analysis Endpoints
 *
 * Provides endpoints to analyze connected integrations and return
 * detected configurations.
 */

const onboarding = new Hono()
    // ----------------------------------------
    // Analyze Jira
    // ----------------------------------------
    .post(
        "/:workspaceId/analyze/jira",
        describeRoute({
            tags: ["Onboarding"],
            summary: "Analyze Jira Workspace",
            description: "Fetches projects/boards to detect workflow type (Kanban/Scrum)",
            responses: {
                200: {
                    description: "Analysis successful",
                    content: {
                        "application/json": {
                            schema: resolver(
                                v.object({
                                    detectedType: v.string(),
                                    confidence: v.number(),
                                    suggestedConfig: v.any(),
                                    raw: v.object({
                                        projects: v.array(v.any()), // Simplified validation
                                        boards: v.array(v.any()),
                                        statuses: v.array(v.any()),
                                    }),
                                }),
                            ),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const workspaceId = c.req.param("workspaceId");

            // 1. Get Workspace & Token
            const workspace = await workspacesService.getWorkspaceById(workspaceId);
            if (!workspace) return c.json({ error: "Workspace not found" }, 404);

            const token = await authService.getOAuthToken(workspaceId, "jira");
            if (!token || !workspace.jiraSite) {
                return c.json({ error: "Jira not connected" }, 400);
            }

            // 2. Analyze
            try {
                const analysis = await jiraAnalyzerService.analyzeWorkspace(
                    workspace.jiraSite,
                    token,
                );
                return c.json(analysis);
            } catch (error) {
                console.error("[Onboarding] Jira analysis failed:", error);
                return c.json({ error: "Analysis failed", details: String(error) }, 500);
            }
        },
    )

    // ----------------------------------------
    // Analyze GitHub
    // ----------------------------------------
    .post(
        "/:workspaceId/analyze/github",
        describeRoute({
            tags: ["Onboarding"],
            summary: "Analyze GitHub Workspace",
            description: "Lists repos and detects CI/CD usage",
            responses: {
                200: {
                    description: "Analysis successful",
                    content: {
                        "application/json": {
                            schema: resolver(
                                v.object({
                                    repos: v.array(v.any()),
                                    cicdSummary: v.object({
                                        reposWithCI: v.number(),
                                        totalRepos: v.number(),
                                        primaryCIProvider: v.string(),
                                    }),
                                    suggestedConfig: v.object({
                                        requireCiPass: v.boolean(),
                                        requireAllChecksPass: v.boolean(),
                                    }),
                                }),
                            ),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const workspaceId = c.req.param("workspaceId");

            // 1. Get Workspace & Token
            // Note: Currently we overload 'githubInstallationId' for OAuth token in existing service
            // This might need cleanup later but sticking to established pattern for now
            const token = await authService.getOAuthToken(workspaceId, "github");

            if (!token) {
                return c.json({ error: "GitHub not connected" }, 400);
            }

            // 2. Analyze
            try {
                const analysis = await githubAnalyzerService.analyzeWorkspace(token);
                return c.json(analysis);
            } catch (error) {
                console.error("[Onboarding] GitHub analysis failed:", error);
                return c.json({ error: "Analysis failed", details: String(error) }, 500);
            }
        },
    );

export default onboarding;
