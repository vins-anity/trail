/**
 * Trail AI Event Schemas
 *
 * Shared schemas for hash-chained event logging.
 * Used by both API and frontend for type safety.
 *
 * @see Section 5.5 in thesis: "Data Integrity: Hash-Chained Event Log"
 */

import * as v from "valibot";

// ============================================
// Enums
// ============================================

export const EventTypeSchema = v.picklist([
    "handshake",
    "handshake_rejected",
    "pr_opened",
    "pr_merged",
    "pr_approved",
    "ci_passed",
    "ci_failed",
    "closure_proposed",
    "closure_approved",
    "closure_vetoed",
    "jira_status_changed",
    "slack_message",
]);

export const TriggerSourceSchema = v.picklist([
    "automatic",
    "jira_webhook",
    "github_webhook",
    "slack_webhook",
    "manual",
]);

// ============================================
// Event Schemas
// ============================================

export const EventSchema = v.object({
    id: v.string(),
    eventType: EventTypeSchema,
    triggerSource: v.optional(TriggerSourceSchema),
    prevHash: v.optional(v.nullable(v.string())),
    eventHash: v.string(),
    payload: v.record(v.string(), v.unknown()),
    workspaceId: v.string(),
    taskId: v.optional(v.nullable(v.string())),
    createdAt: v.string(),
});

export const CreateEventSchema = v.object({
    eventType: EventTypeSchema,
    triggerSource: v.optional(TriggerSourceSchema),
    payload: v.record(v.string(), v.unknown()),
    workspaceId: v.string(),
    taskId: v.optional(v.string()),
});

export const EventListSchema = v.object({
    events: v.array(EventSchema),
    total: v.number(),
    page: v.number(),
    pageSize: v.number(),
    hasMore: v.boolean(),
});

export const EventQuerySchema = v.object({
    workspaceId: v.optional(v.string()),
    taskId: v.optional(v.string()),
    eventType: v.optional(v.string()),
    page: v.optional(v.pipe(v.string(), v.transform(Number))),
    pageSize: v.optional(v.pipe(v.string(), v.transform(Number))),
});

export const ChainVerificationSchema = v.object({
    valid: v.boolean(),
    verifiedCount: v.number(),
    errors: v.array(
        v.object({
            eventId: v.string(),
            index: v.number(),
            type: v.picklist(["broken_link", "invalid_hash"]),
            message: v.string(),
        })
    ),
});

// ============================================
// Types
// ============================================

export type EventType = v.InferOutput<typeof EventTypeSchema>;
export type TriggerSource = v.InferOutput<typeof TriggerSourceSchema>;
export type Event = v.InferOutput<typeof EventSchema>;
export type CreateEvent = v.InferOutput<typeof CreateEventSchema>;
export type EventList = v.InferOutput<typeof EventListSchema>;
export type EventQuery = v.InferOutput<typeof EventQuerySchema>;
export type ChainVerification = v.InferOutput<typeof ChainVerificationSchema>;
