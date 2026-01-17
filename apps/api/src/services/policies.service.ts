/**
 * Policies Service
 *
 * Database operations for closure policies.
 * Implements 3-tier policy system: Agile, Standard, Hardened.
 */

import { and, eq } from "drizzle-orm";
import type { PolicyTier } from "shared";
import { db, schema } from "../db";

// ============================================
// Types
// ============================================

export interface CreatePolicyInput {
    workspaceId: string;
    name: string;
    tier?: PolicyTier;
    description?: string;
    requiredApprovals?: number;
    requireCiPass?: boolean;
    autoCloseDelayHours?: number;
    requireAllChecksPass?: boolean;
    requireLinkedIssue?: boolean;
    isDefault?: boolean;
}

export interface EvaluateClosureInput {
    taskId: string;
    workspaceId: string;
    policyId?: string;
}

export interface ClosureChecks {
    prMerged: boolean;
    ciPassed: boolean;
    approvalsCount: number;
    approvalsRequired: number;
    allChecksPassed: boolean;
    linkedIssueFound: boolean;
}

// ============================================
// Policy Presets
// ============================================

export const POLICY_PRESETS: Record<
    PolicyTier,
    {
        name: string;
        tier: PolicyTier;
        description: string;
        requiredApprovals: number;
        requireCiPass: boolean;
        autoCloseDelayHours: number;
        requireAllChecksPass: boolean;
        requireLinkedIssue: boolean;
    }
> = {
    agile: {
        name: "Agile",
        tier: "agile",
        description: "Fast-moving teams with high trust. 1 approval, 24h auto-close.",
        requiredApprovals: 1,
        requireCiPass: true,
        autoCloseDelayHours: 24,
        requireAllChecksPass: false,
        requireLinkedIssue: false,
    },
    standard: {
        name: "Standard",
        tier: "standard",
        description: "Balanced workflow. 2 approvals, 48h auto-close.",
        requiredApprovals: 2,
        requireCiPass: true,
        autoCloseDelayHours: 48,
        requireAllChecksPass: false,
        requireLinkedIssue: true,
    },
    hardened: {
        name: "Hardened",
        tier: "hardened",
        description: "High-compliance environments. 3 approvals, 72h auto-close.",
        requiredApprovals: 3,
        requireCiPass: true,
        autoCloseDelayHours: 72,
        requireAllChecksPass: true,
        requireLinkedIssue: true,
    },
};

// ============================================
// Service Functions
// ============================================

/**
 * List policies for a workspace
 */
export async function listPolicies(workspaceId?: string) {
    if (workspaceId) {
        return db
            .select()
            .from(schema.policies)
            .where(eq(schema.policies.workspaceId, workspaceId));
    }
    return db.select().from(schema.policies);
}

/**
 * Get policy by ID
 */
export async function getPolicyById(id: string) {
    const [policy] = await db
        .select()
        .from(schema.policies)
        .where(eq(schema.policies.id, id))
        .limit(1);

    return policy || null;
}

/**
 * Get default policy for a workspace
 */
export async function getDefaultPolicy(workspaceId: string) {
    const [policy] = await db
        .select()
        .from(schema.policies)
        .where(
            and(eq(schema.policies.workspaceId, workspaceId), eq(schema.policies.isDefault, true)),
        )
        .limit(1);

    return policy || null;
}

/**
 * Create a new policy
 */
export async function createPolicy(input: CreatePolicyInput) {
    // Apply preset defaults if tier is specified
    const preset = input.tier ? POLICY_PRESETS[input.tier] : POLICY_PRESETS.standard;

    const [policy] = await db
        .insert(schema.policies)
        .values({
            workspaceId: input.workspaceId,
            name: input.name,
            tier: input.tier || "standard",
            description: input.description ?? preset.description,
            requiredApprovals: input.requiredApprovals ?? preset.requiredApprovals,
            requireCiPass: input.requireCiPass ?? preset.requireCiPass,
            autoCloseDelayHours: input.autoCloseDelayHours ?? preset.autoCloseDelayHours,
            requireAllChecksPass: input.requireAllChecksPass ?? preset.requireAllChecksPass,
            requireLinkedIssue: input.requireLinkedIssue ?? preset.requireLinkedIssue,
            isDefault: input.isDefault ?? false,
        })
        .returning();

    return policy;
}

/**
 * Evaluate closure eligibility based on policy
 */
export async function evaluateClosure(input: EvaluateClosureInput, checks: ClosureChecks) {
    // Get policy (either specified or default)
    let policy: schema.Policy | null = null;

    if (input.policyId) {
        policy = await getPolicyById(input.policyId);
    } else {
        policy = await getDefaultPolicy(input.workspaceId);
    }

    // Fall back to standard preset if no policy found
    const policyRules = policy || {
        id: "preset-standard",
        ...POLICY_PRESETS.standard,
    };

    // Evaluate eligibility
    const eligible =
        checks.prMerged &&
        (!policyRules.requireCiPass || checks.ciPassed) &&
        checks.approvalsCount >= policyRules.requiredApprovals &&
        (!policyRules.requireAllChecksPass || checks.allChecksPassed) &&
        (!policyRules.requireLinkedIssue || checks.linkedIssueFound);

    // Determine reason if not eligible
    let reason: string | undefined;
    if (!eligible) {
        if (!checks.prMerged) reason = "PR not merged";
        else if (policyRules.requireCiPass && !checks.ciPassed) reason = "CI not passed";
        else if (checks.approvalsCount < policyRules.requiredApprovals)
            reason = `Insufficient approvals (${checks.approvalsCount}/${policyRules.requiredApprovals})`;
        else if (policyRules.requireAllChecksPass && !checks.allChecksPassed)
            reason = "Not all checks passed";
        else if (policyRules.requireLinkedIssue && !checks.linkedIssueFound)
            reason = "No linked issue found";
    }

    // Calculate scheduled close time if eligible
    const scheduledCloseAt = eligible
        ? new Date(Date.now() + policyRules.autoCloseDelayHours * 60 * 60 * 1000).toISOString()
        : null;

    return {
        eligible,
        policyId: policy?.id || "preset-standard",
        policyName: policyRules.name,
        reason,
        checks,
        scheduledCloseAt,
    };
}

/**
 * Map policy to response format
 */
export function mapPolicyToResponse(policy: schema.Policy) {
    return {
        id: policy.id,
        workspaceId: policy.workspaceId,
        name: policy.name,
        tier: policy.tier,
        description: policy.description,
        requiredApprovals: policy.requiredApprovals,
        requireCiPass: policy.requireCiPass,
        autoCloseDelayHours: policy.autoCloseDelayHours,
        requireAllChecksPass: policy.requireAllChecksPass,
        requireLinkedIssue: policy.requireLinkedIssue,
        isDefault: policy.isDefault,
        isActive: policy.isActive,
        createdAt: policy.createdAt.toISOString(),
    };
}
