/**
 * Trail AI Webhook Schemas
 *
 * Shared schemas for webhook payloads and responses.
 */

import * as v from "valibot";

// ============================================
// Response Schemas
// ============================================

export const WebhookResponseSchema = v.object({
    success: v.boolean(),
    message: v.string(),
    eventId: v.optional(v.string()),
});

// ============================================
// Slack Schemas
// ============================================

export const SlackUrlVerificationSchema = v.object({
    type: v.literal("url_verification"),
    challenge: v.string(),
    token: v.string(),
});

export const SlackEventSchema = v.object({
    type: v.string(),
    user: v.optional(v.string()),
    channel: v.optional(v.string()),
    text: v.optional(v.string()),
    ts: v.optional(v.string()),
});

export const SlackEventCallbackSchema = v.object({
    type: v.literal("event_callback"),
    team_id: v.string(),
    event: SlackEventSchema,
});

// ============================================
// GitHub Schemas
// ============================================

export const GitHubUserSchema = v.object({
    login: v.string(),
    id: v.optional(v.number()),
});

export const GitHubRepoSchema = v.object({
    full_name: v.string(),
    name: v.optional(v.string()),
});

export const GitHubPullRequestSchema = v.object({
    id: v.number(),
    number: v.optional(v.number()),
    title: v.string(),
    state: v.string(),
    merged: v.optional(v.boolean()),
    user: GitHubUserSchema,
    head: v.optional(
        v.object({
            ref: v.string(),
            sha: v.string(),
        })
    ),
    base: v.optional(
        v.object({
            ref: v.string(),
        })
    ),
});

export const GitHubPullRequestEventSchema = v.object({
    action: v.string(),
    number: v.number(),
    pull_request: GitHubPullRequestSchema,
    repository: GitHubRepoSchema,
});

export const GitHubCommitSchema = v.object({
    id: v.string(),
    message: v.string(),
    author: v.object({
        name: v.string(),
        email: v.string(),
    }),
});

export const GitHubPushEventSchema = v.object({
    ref: v.string(),
    commits: v.array(GitHubCommitSchema),
    repository: GitHubRepoSchema,
});

// ============================================
// Jira Schemas
// ============================================

export const JiraUserSchema = v.object({
    displayName: v.string(),
    emailAddress: v.optional(v.string()),
    accountId: v.optional(v.string()),
});

export const JiraStatusSchema = v.object({
    name: v.string(),
    id: v.optional(v.string()),
});

export const JiraIssueFieldsSchema = v.object({
    summary: v.string(),
    status: JiraStatusSchema,
    assignee: v.optional(v.nullable(JiraUserSchema)),
    reporter: v.optional(v.nullable(JiraUserSchema)),
    priority: v.optional(
        v.nullable(
            v.object({
                name: v.string(),
            })
        )
    ),
    issuetype: v.optional(
        v.object({
            name: v.string(),
        })
    ),
});

export const JiraIssueSchema = v.object({
    id: v.string(),
    key: v.string(),
    self: v.optional(v.string()),
    fields: JiraIssueFieldsSchema,
});

export const JiraChangelogItemSchema = v.object({
    field: v.string(),
    fieldtype: v.optional(v.string()),
    fromString: v.optional(v.nullable(v.string())),
    toString: v.optional(v.nullable(v.string())),
});

export const JiraChangelogSchema = v.object({
    items: v.array(JiraChangelogItemSchema),
});

export const JiraIssueEventSchema = v.object({
    webhookEvent: v.string(),
    issue: JiraIssueSchema,
    changelog: v.optional(JiraChangelogSchema),
    user: v.optional(JiraUserSchema),
});

// ============================================
// Types
// ============================================

export type WebhookResponse = v.InferOutput<typeof WebhookResponseSchema>;
export type SlackEvent = v.InferOutput<typeof SlackEventSchema>;
export type GitHubPullRequestEvent = v.InferOutput<typeof GitHubPullRequestEventSchema>;
export type GitHubPushEvent = v.InferOutput<typeof GitHubPushEventSchema>;
export type JiraIssue = v.InferOutput<typeof JiraIssueSchema>;
export type JiraIssueEvent = v.InferOutput<typeof JiraIssueEventSchema>;
