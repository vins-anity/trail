import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/valibot";
import { type JiraIssueEvent, WebhookResponseSchema } from "shared";
import {
    verifyGitHubSignature,
    verifyJiraSignature,
    verifySlackSignature,
} from "../../middleware/verify-webhook";

/**
 * Webhook Router Module
 *
 * Ingests events from external tools (Slack, GitHub, Jira).
 * Each provider has signature verification and event parsing.
 *
 * @see Section 5.4.1 in thesis: "Webhook Router"
 */

// ============================================
// Routes
// ============================================

const webhooks = new Hono()
    // ----------------------------------------
    // Slack Webhook
    // ----------------------------------------
    .post(
        "/slack",
        verifySlackSignature,
        describeRoute({
            tags: ["Webhooks"],
            summary: "Receive Slack webhook events",
            description:
                "Endpoint for Slack to send events (messages, reactions, etc.). Handles URL verification and event callbacks.",
            responses: {
                200: {
                    description: "Webhook processed successfully",
                    content: {
                        "application/json": {
                            schema: resolver(WebhookResponseSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const rawBody = c.get("rawBody") || (await c.req.text());
            const payload = JSON.parse(rawBody);

            // Handle Slack URL verification challenge
            if (payload.type === "url_verification") {
                return c.json({ challenge: payload.challenge });
            }

            // Handle event callbacks
            if (payload.type === "event_callback") {
                // TODO: Look up workspace by team_id
                // TODO: Create hash-chained event
                // For now, just acknowledge

                return c.json({
                    success: true,
                    message: "Slack event received",
                });
            }

            return c.json({ success: true, message: "Slack webhook acknowledged" });
        },
    )

    // ----------------------------------------
    // GitHub Webhook
    // ----------------------------------------
    .post(
        "/github",
        verifyGitHubSignature,
        describeRoute({
            tags: ["Webhooks"],
            summary: "Receive GitHub webhook events",
            description:
                "Endpoint for GitHub to send events (PR merged, approvals, CI status). Core signals for Optimistic Closure.",
            responses: {
                200: {
                    description: "Webhook processed successfully",
                    content: {
                        "application/json": {
                            schema: resolver(WebhookResponseSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const rawBody = c.get("rawBody") || (await c.req.text());
            const payload = JSON.parse(rawBody);
            const eventType = c.req.header("X-GitHub-Event");

            // Map GitHub events to Trail AI event types
            let _trailEventType: string | null = null;
            const eventPayload: Record<string, unknown> = { raw: payload };

            switch (eventType) {
                case "pull_request":
                    if (payload.action === "opened") {
                        _trailEventType = "pr_opened";
                    } else if (payload.action === "closed" && payload.pull_request?.merged) {
                        _trailEventType = "pr_merged";
                    }
                    eventPayload.prNumber = payload.number;
                    eventPayload.prTitle = payload.pull_request?.title;
                    eventPayload.repository = payload.repository?.full_name;
                    break;

                case "pull_request_review":
                    if (payload.action === "submitted" && payload.review?.state === "approved") {
                        _trailEventType = "pr_approved";
                    }
                    eventPayload.prNumber = payload.pull_request?.number;
                    eventPayload.reviewer = payload.review?.user?.login;
                    break;

                case "check_suite":
                case "check_run":
                    if (payload.action === "completed") {
                        _trailEventType =
                            payload.conclusion === "success" ? "ci_passed" : "ci_failed";
                    }
                    break;

                default:
            }

            // TODO: Look up workspace by repository/org
            // TODO: Create hash-chained event if trailEventType is set

            return c.json({
                success: true,
                message: `GitHub ${eventType} event received`,
            });
        },
    )

    // ----------------------------------------
    // Jira Webhook
    // ----------------------------------------
    .post(
        "/jira",
        verifyJiraSignature,
        describeRoute({
            tags: ["Webhooks"],
            summary: "Receive Jira webhook events",
            description:
                "Endpoint for Jira to send events (issue transitions). Triggers Passive Handshake on 'In Progress'.",
            responses: {
                200: {
                    description: "Webhook processed successfully",
                    content: {
                        "application/json": {
                            schema: resolver(WebhookResponseSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const rawBody = c.get("rawBody") || (await c.req.text());
            const payload = JSON.parse(rawBody) as JiraIssueEvent;

            // Check for status change (Passive Handshake trigger)
            const statusChange = payload.changelog?.items?.find((item) => item.field === "status");

            if (statusChange) {
                const fromStatus = statusChange.fromString;
                const toStatus = statusChange.toString;

                // Trigger Passive Handshake when moving to "In Progress"
                if (toStatus?.toLowerCase().includes("in progress")) {
                    // TODO: Look up workspace by Jira site
                    // TODO: Create "handshake" event
                    // TODO: Send Slack DM notification
                }
            }

            return c.json({
                success: true,
                message: "Jira webhook received",
            });
        },
    );

export default webhooks;
export type WebhooksApp = typeof webhooks;
