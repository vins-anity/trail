import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/valibot";
import { type EventType, type JiraIssueEvent, WebhookResponseSchema } from "shared";
import { cancelClosureJob, scheduleClosureCheck } from "../../lib/job-queue";
import { RateLimits, rateLimiter } from "../../middleware/rate-limiter";
import {
    verifyGitHubSignature,
    verifyJiraSignature,
    verifySlackSignature,
} from "../../middleware/verify-webhook";
import { eventsService, policiesService, slackService, workspacesService } from "../../services";

/**
 * Webhook Router Module
 * @see Section 5.4.1 in thesis: "Webhook Router"
 */

/**
 * Helper: Extract Task ID from string (e.g., "[TRAIL-123] Feature" -> "TRAIL-123")
 */
function extractTaskId(text: string | undefined): string | null {
    if (!text) return null;
    const match = text.match(/([A-Z]+-\d+)/);
    return match ? (match[1] ?? null) : null;
}

const webhooks = new Hono()
    // ----------------------------------------
    // Slack Events Webhook
    // ----------------------------------------
    .post(
        "/slack/events",
        rateLimiter(RateLimits.webhooks),
        verifySlackSignature,
        describeRoute({
            tags: ["Webhooks"],
            summary: "Receive Slack webhook events",
            description: "Endpoint for Slack Events API (url_verification, messages, etc.).",
            responses: {
                200: {
                    content: { "application/json": { schema: resolver(WebhookResponseSchema) } },
                    description: "OK",
                },
            },
        }),
        async (c) => {
            const rawBody = c.get("rawBody") || (await c.req.text());
            const payload = JSON.parse(rawBody);

            // Slack URL verification challenge
            if (payload.type === "url_verification") {
                return c.json({ challenge: payload.challenge });
            }

            // Handle actual events (e.g., messages, app mentions)
            if (payload.event) {
                console.log(`[Slack Event] ${payload.event.type}:`, payload.event);
                // Future: Handle specific event types (app_mention, message, etc.)
            }

            return c.json({ success: true, message: "Slack event received" });
        },
    )

    // ----------------------------------------
    // Slack Interactive Components (Buttons, Modals)
    // ----------------------------------------
    .post(
        "/slack/interactive",
        rateLimiter(RateLimits.webhooks),
        verifySlackSignature,
        describeRoute({
            tags: ["Webhooks"],
            summary: "Receive Slack interactive components",
            description: "Handles button clicks (Reject, Veto), modal submissions, etc.",
            responses: {
                200: {
                    content: { "application/json": { schema: resolver(WebhookResponseSchema) } },
                    description: "OK",
                },
            },
        }),
        async (c) => {
            const rawBody = c.get("rawBody") || (await c.req.text());
            // Slack sends interactive payloads as form-encoded with 'payload' field
            const formData = new URLSearchParams(rawBody);
            const payloadStr = formData.get("payload");

            if (!payloadStr) {
                return c.json({ success: false, message: "No payload found" }, 400);
            }

            const payload = JSON.parse(payloadStr);
            console.log(`[Slack Interactive] Type: ${payload.type}, Action:`, payload.actions);

            // Workspace Lookup
            const teamId = payload.team?.id;
            const workspace = teamId ? await workspacesService.findBySlackTeamId(teamId) : null;

            if (!workspace) {
                console.warn(`[Slack Webhook] No workspace found for team: ${teamId}`);
                return c.json({ success: false, message: "Workspace not found" }, 404);
            }

            // Handle button actions
            if (payload.type === "block_actions" && payload.actions) {
                const action = payload.actions[0];
                const actionId = action.action_id;
                const taskId = action.value; // Assuming button value contains taskId
                const userId = payload.user?.id; // Slack User ID

                // Example: Handle "Reject" button from Passive Handshake
                if (actionId === "reject_task") {
                    console.log(`[Slack] Developer rejected task: ${taskId}`);

                    await eventsService.createEvent({
                        workspaceId: workspace.id,
                        taskId,
                        eventType: "handshake_rejected",
                        triggerSource: "slack_webhook",
                        payload: {
                            rejectedBySlackUser: userId,
                            raw: payload,
                        },
                    });

                    return c.json({
                        response_type: "ephemeral",
                        text: `✅ Task ${taskId} has been rejected. Your PM will be notified.`,
                    });
                }

                // Example: Handle "Veto" button from Optimistic Closure
                if (actionId === "veto_closure") {
                    console.log(`[Slack] Manager vetoed closure for task: ${taskId}`);

                    // 1. Find the Closure Job ID from the most recent 'closure_proposed' event
                    const { events } = await eventsService.listEvents({
                        workspaceId: workspace.id,
                        taskId,
                        eventType: "closure_proposed",
                        pageSize: 1,
                    });

                    const lastProposal = events[0];
                    const jobId = lastProposal?.payload?.pgBossJobId as string | undefined;

                    // 2. Cancel the job if found
                    let cancelled = false;
                    if (jobId) {
                        cancelled = await cancelClosureJob(jobId);
                    } else {
                        console.warn(`[Slack] No job ID found for closure veto task ${taskId}`);
                    }

                    // 3. Log veto event
                    await eventsService.createEvent({
                        workspaceId: workspace.id,
                        taskId,
                        eventType: "closure_vetoed",
                        triggerSource: "slack_webhook",
                        payload: {
                            vetoedBySlackUser: userId,
                            cancelledJob: cancelled,
                            jobId,
                            raw: payload,
                        },
                    });

                    return c.json({
                        text: `🛑 Auto-closure vetoed for ${taskId}. Task remains open.`,
                    });
                }
            }

            return c.json({ success: true, message: "Interactive payload processed" });
        },
    )

    // ----------------------------------------
    // GitHub Webhook
    // ----------------------------------------
    .post(
        "/github",
        rateLimiter(RateLimits.webhooks),
        verifyGitHubSignature,
        describeRoute({
            tags: ["Webhooks"],
            summary: "Receive GitHub webhook events",
            description: "Signals: pr_merged, pr_approved, ci_passed.",
            responses: {
                200: {
                    content: { "application/json": { schema: resolver(WebhookResponseSchema) } },
                    description: "OK",
                },
            },
        }),
        async (c) => {
            const rawBody = c.get("rawBody") || (await c.req.text());
            const payload = JSON.parse(rawBody);
            const eventType = c.req.header("X-GitHub-Event");

            // 1. Identify Workspace
            const orgName = payload.repository?.owner?.login;
            if (!orgName) {
                return c.json({ success: false, message: "No repository owner found" }, 400);
            }

            const workspace = await workspacesService.findByGitHubOrg(orgName);
            if (!workspace) {
                console.warn(`[GitHub Webhook] No workspace found for org: ${orgName}`);
                return c.json({ success: false, message: "Workspace not found" }, 404);
            }

            // 2. Identify Task ID
            const branchName = payload.pull_request?.head?.ref;
            const prTitle = payload.pull_request?.title;
            const taskId = extractTaskId(branchName) || extractTaskId(prTitle);

            // 3. Map Event
            let _trailEventType: EventType | null = null;
            const eventPayload: Record<string, unknown> = {
                raw: payload,
                repo: payload.repository?.full_name,
                sender: payload.sender?.login,
            };

            switch (eventType) {
                case "pull_request":
                    if (payload.action === "opened") {
                        _trailEventType = "pr_opened";
                    } else if (payload.action === "closed" && payload.pull_request?.merged) {
                        _trailEventType = "pr_merged";
                    }
                    eventPayload.prNumber = payload.number;
                    eventPayload.prTitle = payload.pull_request?.title;
                    break;
                case "pull_request_review":
                    if (payload.action === "submitted" && payload.review?.state === "approved") {
                        _trailEventType = "pr_approved";
                    }
                    eventPayload.prNumber = payload.pull_request?.number;
                    break;
                case "check_suite":
                case "check_run":
                    if (payload.action === "completed") {
                        _trailEventType =
                            payload.conclusion === "success" ? "ci_passed" : "ci_failed";
                    } else {
                        return c.json({ success: true, message: "Ignoring check in progress" });
                    }
                    break;
            }

            if (_trailEventType) {
                // 4. Log Event
                await eventsService.createEvent({
                    workspaceId: workspace.id,
                    taskId: taskId || undefined,
                    eventType: _trailEventType,
                    triggerSource: "github_webhook",
                    payload: eventPayload,
                });

                console.log(`[GitHub] Logged event ${_trailEventType} for task ${taskId}`);

                // 5. Optimistic Closure (on Merge)
                if (_trailEventType === "pr_merged" && taskId) {
                    const mockChecks = {
                        prMerged: true,
                        ciPassed: true,
                        approvalsCount: 1,
                        approvalsRequired: 1,
                        allChecksPassed: true,
                        linkedIssueFound: true,
                    };

                    const checkResult = await policiesService.evaluateClosure(
                        { taskId, workspaceId: workspace.id },
                        mockChecks,
                    );

                    if (checkResult.eligible) {
                        console.log(
                            `[GitHub] Task ${taskId} eligible for Optimistic Closure. Scheduling...`,
                        );

                        if (checkResult.scheduledCloseAt) {
                            const delayMs =
                                new Date(checkResult.scheduledCloseAt).getTime() - Date.now();
                            const delayHours = Math.max(0, delayMs / (1000 * 60 * 60)); // ensure non-negative

                            // Schedule closure check (default 24h)
                            // Parse timeout from string "24h" -> 24 if needed, assuming delayHours is number
                            const jobId = await scheduleClosureCheck(
                                workspace.id,
                                taskId,
                                delayHours,
                            );

                            // Log proposal (Include Job ID for potential Veto)
                            await eventsService.createEvent({
                                workspaceId: workspace.id,
                                taskId,
                                eventType: "closure_proposed",
                                triggerSource: "automatic",
                                payload: {
                                    policyId: checkResult.policyId,
                                    scheduledCloseAt: checkResult.scheduledCloseAt,
                                    pgBossJobId: jobId,
                                },
                            });

                            // PHASE 3: Send Slack closure proposal notification to manager (per thesis)
                            const prAuthorEmail = payload.pull_request?.user?.email || null;
                            if (prAuthorEmail && workspace.slackAccessToken) {
                                await slackService.sendClosureProposal(
                                    workspace.id,
                                    taskId,
                                    payload.pull_request?.title ||
                                        `PR #${payload.pull_request?.number}`,
                                    prAuthorEmail,
                                    new Date(checkResult.scheduledCloseAt),
                                );
                            }
                        }
                    }
                }
            }

            return c.json({ success: true, message: `GitHub ${eventType} processed` });
        },
    )

    // ----------------------------------------
    // Jira Webhook
    // ----------------------------------------
    .post(
        "/jira",
        rateLimiter(RateLimits.webhooks),
        verifyJiraSignature,
        describeRoute({
            tags: ["Webhooks"],
            summary: "Receive Jira webhook events",
            description: "Triggers Passive Handshake on 'In Progress'.",
            responses: {
                200: {
                    content: { "application/json": { schema: resolver(WebhookResponseSchema) } },
                    description: "OK",
                },
            },
        }),
        async (c) => {
            const rawBody = c.get("rawBody") || (await c.req.text());
            const payload = JSON.parse(rawBody) as JiraIssueEvent;

            // 1. Identify Workspace (by self URL)
            // Payload often has `issue.self`: "https://site.atlassian.net/rest/api/2/issue/10001"
            let jiraDomain = null;
            if (payload.issue?.self) {
                const url = new URL(payload.issue.self);
                jiraDomain = url.hostname; // site.atlassian.net
            }

            if (!jiraDomain) {
                return c.json({ success: false, message: "Could not identify Jira domain" }, 400);
            }

            const workspace = await workspacesService.findByJiraSite(jiraDomain);
            if (!workspace) {
                // Try finding by generic integration if simpler?
                // For now, strict match.
                console.warn(`[Jira Webhook] No workspace found for domain: ${jiraDomain}`);
                return c.json({ success: false, message: "Workspace not found" }, 404);
            }

            // 2. Check Status Change
            const statusChange = payload.changelog?.items?.find((item) => item.field === "status");

            if (statusChange) {
                const toStatus = statusChange.toString;

                // Trigger Passive Handshake when moving to "In Progress"
                if (toStatus?.toLowerCase().includes("in progress")) {
                    console.log(`[Jira] Passive Handshake detected for ${payload.issue?.key}`);

                    const taskId = payload.issue?.key || "UNKNOWN";
                    const taskTitle = payload.issue?.fields?.summary || "Untitled Task";

                    // Type assertion safe here

                    await eventsService.createEvent({
                        workspaceId: workspace.id,
                        taskId,
                        eventType: "handshake",
                        triggerSource: "jira_webhook",
                        payload: {
                            issueTitle: taskTitle,
                            status: toStatus,
                            user: payload.user?.displayName,
                            raw: payload,
                        },
                    });

                    // PHASE 1: Send Slack notification to developer (per thesis)
                    const assigneeEmail = payload.issue?.fields?.assignee?.emailAddress;
                    if (assigneeEmail && workspace.slackAccessToken) {
                        await slackService.sendHandshakeNotification(
                            workspace.id,
                            taskId,
                            taskTitle,
                            assigneeEmail,
                        );
                    }
                } else {
                    // Type assertion safe here

                    await eventsService.createEvent({
                        workspaceId: workspace.id,
                        taskId: payload.issue?.key || "UNKNOWN",
                        eventType: "jira_status_changed",
                        triggerSource: "jira_webhook",
                        payload: {
                            status: toStatus,
                            raw: payload,
                        },
                    });
                }
            }

            return c.json({ success: true, message: "Jira webhook received" });
        },
    );

export default webhooks;
export type WebhooksApp = typeof webhooks;
