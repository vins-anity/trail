/**
 * Trail AI Database Schema
 *
 * This schema implements the data model from the Trail AI thesis document.
 * Key features:
 * - Hash-chained events for tamper-evident audit trail
 * - Workspaces for multi-tenant support
 * - Proof Packets for delivery receipts
 * - Policies for closure rules
 *
 * @see Appendix A: Event Log Schema
 * @see Appendix B: Proof Packet JSON Schema
 */

import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

// ============================================
// Enums
// ============================================

export const eventTypeEnum = pgEnum("event_type", [
    "handshake", // Task accepted (passive detection)
    "handshake_rejected", // Task explicitly rejected
    "pr_opened", // GitHub PR created
    "pr_merged", // GitHub PR merged
    "pr_approved", // GitHub PR approved
    "ci_passed", // CI pipeline passed
    "ci_failed", // CI pipeline failed
    "closure_proposed", // Optimistic closure initiated
    "closure_approved", // Manual or auto approval
    "closure_vetoed", // Manager veto
    "jira_status_changed", // Jira ticket status update
    "slack_message", // Relevant Slack message
]);

export const triggerSourceEnum = pgEnum("trigger_source", [
    "automatic", // System-triggered
    "jira_webhook", // From Jira
    "github_webhook", // From GitHub
    "slack_webhook", // From Slack
    "manual", // User-initiated
]);

export const proofStatusEnum = pgEnum("proof_status", [
    "draft", // Proof packet being assembled
    "pending", // Awaiting closure
    "finalized", // Closed and immutable
    "exported", // Shared externally
]);

export const policyTierEnum = pgEnum("policy_tier", [
    "agile", // 1 approval, 24h auto-close
    "standard", // 2 approvals, 48h auto-close
    "hardened", // 3 approvals, 72h auto-close
]);

// ============================================
// Tables
// ============================================

/**
 * Workspaces - Multi-tenant support
 * Each workspace represents a team/organization with their integrations.
 */
export const workspaces = pgTable("workspaces", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),

    // Integration identifiers
    slackTeamId: text("slack_team_id"),
    slackAccessToken: text("slack_access_token"), // Encrypted
    githubOrg: text("github_org"),
    githubInstallationId: text("github_installation_id"),
    jiraSite: text("jira_site"),
    jiraAccessToken: text("jira_access_token"), // Encrypted

    // Settings
    defaultPolicyTier: policyTierEnum("default_policy_tier").default("standard"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Events - Hash-Chained Audit Log
 *
 * Each event includes `prev_hash` linking to the previous event's `event_hash`,
 * forming a blockchain-like structure for tamper-evident logging.
 *
 * @see Appendix A in thesis
 */
export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),

    // Hash chain fields
    prevHash: text("prev_hash"), // Hash of previous event (null for first)
    eventHash: text("event_hash").notNull(), // SHA-256 hash of this event

    // Event metadata
    eventType: eventTypeEnum("event_type").notNull(),
    triggerSource: triggerSourceEnum("trigger_source").default("automatic"),

    // Event payload (flexible JSON)
    payload: jsonb("payload").notNull().$type<Record<string, unknown>>(),

    // References
    workspaceId: uuid("workspace_id")
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    taskId: text("task_id"), // Jira issue key or external ID
    proofPacketId: uuid("proof_packet_id"), // Link to proof packet if applicable

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Proof Packets - Shareable Delivery Receipts
 *
 * Aggregates task metadata into a tamper-evident, exportable format.
 * Includes AI-generated summaries for client-friendly narratives.
 *
 * @see Appendix B in thesis
 */
export const proofPackets = pgTable("proof_packets", {
    id: uuid("id").primaryKey().defaultRandom(),

    // References
    workspaceId: uuid("workspace_id")
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    taskId: text("task_id").notNull(), // Jira issue key or external ID

    // Status
    status: proofStatusEnum("status").default("draft"),

    // AI-generated content
    aiSummary: text("ai_summary"), // Gemini-generated summary
    aiSummaryModel: text("ai_summary_model"), // Model used (e.g., gemini-1.5-flash)

    // Key events
    handshakeEventId: uuid("handshake_event_id").references(() => events.id),
    closureEventId: uuid("closure_event_id").references(() => events.id),

    // Proof metadata
    hashChainRoot: text("hash_chain_root"), // Root hash for verification
    exportedUrl: text("exported_url"), // Public share URL if exported

    // Timestamps
    closedAt: timestamp("closed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Policies - Closure Rules
 *
 * Defines requirements for optimistic closure based on tier.
 * 3-tier system: Agile, Standard, Hardened
 */
export const policies = pgTable("policies", {
    id: uuid("id").primaryKey().defaultRandom(),

    workspaceId: uuid("workspace_id")
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    tier: policyTierEnum("tier").default("standard"),
    description: text("description"),

    // Requirements
    requiredApprovals: integer("required_approvals").default(1).notNull(),
    requireCiPass: boolean("require_ci_pass").default(true).notNull(),
    autoCloseDelayHours: integer("auto_close_delay_hours").default(24).notNull(),

    // Additional rules
    requireAllChecksPass: boolean("require_all_checks_pass").default(false),
    requireLinkedIssue: boolean("require_linked_issue").default(false),

    isDefault: boolean("is_default").default(false),
    isActive: boolean("is_active").default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Closure Jobs - Scheduled Auto-Close Tasks
 *
 * Tracks optimistic closure proposals with scheduled finalization.
 * Uses pg-boss for job queue management.
 */
export const closureJobs = pgTable("closure_jobs", {
    id: uuid("id").primaryKey().defaultRandom(),

    proofPacketId: uuid("proof_packet_id")
        .notNull()
        .references(() => proofPackets.id, { onDelete: "cascade" }),
    policyId: uuid("policy_id")
        .notNull()
        .references(() => policies.id),

    // Job status
    status: text("status")
        .default("pending")
        .$type<"pending" | "completed" | "cancelled" | "vetoed">(),
    scheduledFor: timestamp("scheduled_for").notNull(),

    // Veto tracking
    vetoedBy: text("vetoed_by"),
    vetoReason: text("veto_reason"),
    vetoedAt: timestamp("vetoed_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
});

// ============================================
// Relations
// ============================================

export const workspacesRelations = relations(workspaces, ({ many }) => ({
    events: many(events),
    proofPackets: many(proofPackets),
    policies: many(policies),
}));

export const eventsRelations = relations(events, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [events.workspaceId],
        references: [workspaces.id],
    }),
    proofPacket: one(proofPackets, {
        fields: [events.proofPacketId],
        references: [proofPackets.id],
    }),
}));

export const proofPacketsRelations = relations(proofPackets, ({ one, many }) => ({
    workspace: one(workspaces, {
        fields: [proofPackets.workspaceId],
        references: [workspaces.id],
    }),
    handshakeEvent: one(events, {
        fields: [proofPackets.handshakeEventId],
        references: [events.id],
    }),
    closureEvent: one(events, {
        fields: [proofPackets.closureEventId],
        references: [events.id],
    }),
    closureJobs: many(closureJobs),
}));

export const policiesRelations = relations(policies, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [policies.workspaceId],
        references: [workspaces.id],
    }),
}));

export const closureJobsRelations = relations(closureJobs, ({ one }) => ({
    proofPacket: one(proofPackets, {
        fields: [closureJobs.proofPacketId],
        references: [proofPackets.id],
    }),
    policy: one(policies, {
        fields: [closureJobs.policyId],
        references: [policies.id],
    }),
}));

// ============================================
// Type Exports
// ============================================

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type ProofPacket = typeof proofPackets.$inferSelect;
export type NewProofPacket = typeof proofPackets.$inferInsert;

export type Policy = typeof policies.$inferSelect;
export type NewPolicy = typeof policies.$inferInsert;

export type ClosureJob = typeof closureJobs.$inferSelect;
export type NewClosureJob = typeof closureJobs.$inferInsert;
