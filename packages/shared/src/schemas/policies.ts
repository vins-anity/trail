/**
 * Trail AI Policy Schemas
 *
 * Shared schemas for closure policies.
 *
 * @see Section 5.4.3 in thesis: "Policy & Optimistic Engine"
 */

import * as v from "valibot";

// ============================================
// Enums
// ============================================

export const PolicyTierSchema = v.picklist(["agile", "standard", "hardened"]);

// ============================================
// Schemas
// ============================================

export const PolicySchema = v.object({
    id: v.string(),
    workspaceId: v.string(),
    name: v.string(),
    tier: PolicyTierSchema,
    description: v.optional(v.nullable(v.string())),
    requiredApprovals: v.number(),
    requireCiPass: v.boolean(),
    autoCloseDelayHours: v.number(),
    requireAllChecksPass: v.boolean(),
    requireLinkedIssue: v.boolean(),
    isDefault: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.string(),
});

export const PolicyListSchema = v.object({
    policies: v.array(PolicySchema),
});

export const CreatePolicySchema = v.object({
    workspaceId: v.string(),
    name: v.pipe(v.string(), v.minLength(1, "Name is required")),
    tier: v.optional(PolicyTierSchema),
    description: v.optional(v.string()),
    requiredApprovals: v.optional(v.pipe(v.number(), v.minValue(0))),
    requireCiPass: v.optional(v.boolean()),
    autoCloseDelayHours: v.optional(v.pipe(v.number(), v.minValue(1))),
    requireAllChecksPass: v.optional(v.boolean()),
    requireLinkedIssue: v.optional(v.boolean()),
    isDefault: v.optional(v.boolean()),
});

export const UpdatePolicySchema = v.object({
    name: v.optional(v.pipe(v.string(), v.minLength(1))),
    description: v.optional(v.string()),
    requiredApprovals: v.optional(v.pipe(v.number(), v.minValue(0))),
    requireCiPass: v.optional(v.boolean()),
    autoCloseDelayHours: v.optional(v.pipe(v.number(), v.minValue(1))),
    requireAllChecksPass: v.optional(v.boolean()),
    requireLinkedIssue: v.optional(v.boolean()),
    isDefault: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
});

export const EvaluateClosureSchema = v.object({
    taskId: v.string(),
    workspaceId: v.string(),
    policyId: v.optional(v.string()),
});

export const ClosureChecksSchema = v.object({
    prMerged: v.boolean(),
    ciPassed: v.boolean(),
    approvalsCount: v.number(),
    approvalsRequired: v.number(),
    allChecksPassed: v.boolean(),
    linkedIssueFound: v.boolean(),
});

export const EvaluationResultSchema = v.object({
    eligible: v.boolean(),
    policyId: v.string(),
    policyName: v.string(),
    reason: v.optional(v.string()),
    checks: ClosureChecksSchema,
    scheduledCloseAt: v.optional(v.nullable(v.string())),
});

// ============================================
// Types
// ============================================

export type PolicyTier = v.InferOutput<typeof PolicyTierSchema>;
export type Policy = v.InferOutput<typeof PolicySchema>;
export type PolicyList = v.InferOutput<typeof PolicyListSchema>;
export type CreatePolicy = v.InferOutput<typeof CreatePolicySchema>;
export type UpdatePolicy = v.InferOutput<typeof UpdatePolicySchema>;
export type EvaluateClosure = v.InferOutput<typeof EvaluateClosureSchema>;
export type ClosureChecks = v.InferOutput<typeof ClosureChecksSchema>;
export type EvaluationResult = v.InferOutput<typeof EvaluationResultSchema>;
