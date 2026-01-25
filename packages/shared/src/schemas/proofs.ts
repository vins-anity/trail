/**
 * ShipDocket Proof Packet Schemas
 *
 * Shared schemas for Proof Packets (shareable delivery receipts).
 *
 * @see Section 5.4.4 in thesis: "Proof Packet Generator"
 * @see Appendix B: Proof Packet JSON Schema
 */

import * as v from "valibot";

// ============================================
// Enums
// ============================================

export const ProofStatusSchema = v.picklist(["draft", "pending", "finalized", "exported"]);

export const ClosureTypeSchema = v.picklist(["auto", "manual", "vetoed"]);

// ============================================
// Sub-Schemas
// ============================================

export const TaskSchema = v.object({
    id: v.string(),
    key: v.string(),
    summary: v.string(),
    type: v.optional(v.string()),
    priority: v.optional(v.string()),
    assignee: v.optional(v.string()),
    reporter: v.optional(v.string()),
});

export const HandshakeSchema = v.object({
    eventId: v.string(),
    triggeredAt: v.string(),
    triggerSource: v.string(),
    assignee: v.optional(v.string()),
    rejectedAt: v.optional(v.nullable(v.string())),
});

export const ApprovalSchema = v.object({
    reviewer: v.string(),
    approvedAt: v.string(),
});

export const CommitSchema = v.object({
    hash: v.string(),
    message: v.string(),
    author: v.string(),
});

export const ExecutionSchema = v.object({
    prUrl: v.optional(v.nullable(v.string())),
    prMergedAt: v.optional(v.nullable(v.string())),
    approvals: v.array(ApprovalSchema),
    ciPassed: v.boolean(),
    ciPassedAt: v.optional(v.nullable(v.string())),
    commits: v.array(CommitSchema),
});

export const ClosureSchema = v.object({
    eventId: v.optional(v.string()),
    closedAt: v.optional(v.nullable(v.string())),
    closureType: v.optional(ClosureTypeSchema),
    vetoedBy: v.optional(v.nullable(v.string())),
    vetoReason: v.optional(v.nullable(v.string())),
});

// ============================================
// Main Schemas
// ============================================

export const ProofPacketSchema = v.object({
    id: v.string(),
    workspaceId: v.string(),
    status: ProofStatusSchema,
    task: TaskSchema,
    aiSummary: v.optional(v.nullable(v.string())),
    aiSummaryModel: v.optional(v.nullable(v.string())),
    handshake: v.optional(HandshakeSchema),
    execution: v.optional(ExecutionSchema),
    closure: v.optional(ClosureSchema),
    hashChainRoot: v.optional(v.nullable(v.string())),
    exportedUrl: v.optional(v.nullable(v.string())),
    createdAt: v.string(),
    updatedAt: v.string(),
});

export const CreateProofPacketSchema = v.object({
    workspaceId: v.string(),
    taskId: v.string(),
    taskKey: v.string(),
    taskSummary: v.string(),
});

export const ProofPacketListSchema = v.object({
    packets: v.array(ProofPacketSchema),
    total: v.number(),
    page: v.number(),
    pageSize: v.number(),
});

export const GenerateSummarySchema = v.object({
    includeCommits: v.optional(v.boolean()),
    includePrDescription: v.optional(v.boolean()),
    tone: v.optional(v.picklist(["professional", "casual", "technical"])),
});

export const ShareResultSchema = v.object({
    success: v.boolean(),
    shareUrl: v.string(),
    expiresAt: v.string(),
});

export const ExportResultSchema = v.object({
    success: v.boolean(),
    url: v.string(),
    expiresAt: v.string(),
});

// ============================================
// Types
// ============================================

export type ProofStatus = v.InferOutput<typeof ProofStatusSchema>;
export type ClosureType = v.InferOutput<typeof ClosureTypeSchema>;
export type Task = v.InferOutput<typeof TaskSchema>;
export type Handshake = v.InferOutput<typeof HandshakeSchema>;
export type Approval = v.InferOutput<typeof ApprovalSchema>;
export type Commit = v.InferOutput<typeof CommitSchema>;
export type Execution = v.InferOutput<typeof ExecutionSchema>;
export type Closure = v.InferOutput<typeof ClosureSchema>;
export type ProofPacket = v.InferOutput<typeof ProofPacketSchema>;
export type CreateProofPacket = v.InferOutput<typeof CreateProofPacketSchema>;
export type ProofPacketList = v.InferOutput<typeof ProofPacketListSchema>;
export type GenerateSummary = v.InferOutput<typeof GenerateSummarySchema>;
