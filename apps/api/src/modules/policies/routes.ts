import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as vValidator } from "hono-openapi/valibot";
import {
    CreatePolicySchema,
    EvaluateClosureSchema,
    EvaluationResultSchema,
    PolicyListSchema,
    PolicySchema,
    type PolicyTier,
    PolicyTierSchema,
} from "shared";
import * as v from "valibot";

/**
 * Policies Module
 *
 * Manages closure policies and the Optimistic Closure Engine.
 * 3-tier system: Agile, Standard, Hardened
 *
 * @see Section 5.4.3 in thesis: "Policy & Optimistic Engine"
 */

// ============================================
// Default Policy Presets
// ============================================

const POLICY_PRESETS: Record<
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
// Routes
// ============================================

const policies = new Hono()
    // ----------------------------------------
    // List Policies
    // ----------------------------------------
    .get(
        "/",
        describeRoute({
            tags: ["Policies"],
            summary: "List available closure policies",
            description:
                "Returns all configured closure policies. Filter by workspace to get workspace-specific policies.",
            responses: {
                200: {
                    description: "List of policies",
                    content: {
                        "application/json": {
                            schema: resolver(PolicyListSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspaceId");

            // TODO: Fetch from database
            // For now, return preset policies
            const now = new Date().toISOString();
            const policyList = Object.values(POLICY_PRESETS).map((preset, index) => ({
                id: `preset-${preset.tier}`,
                workspaceId: workspaceId || "default",
                ...preset,
                isDefault: index === 1, // Standard is default
                isActive: true,
                createdAt: now,
            }));

            return c.json({ policies: policyList });
        },
    )

    // ----------------------------------------
    // Get Policy Presets
    // ----------------------------------------
    .get(
        "/presets",
        describeRoute({
            tags: ["Policies"],
            summary: "Get policy presets",
            description:
                "Returns the three built-in policy presets: Agile, Standard, and Hardened.",
            responses: {
                200: {
                    description: "Policy presets",
                    content: {
                        "application/json": {
                            schema: resolver(
                                v.object({
                                    presets: v.record(
                                        v.string(),
                                        v.object({
                                            name: v.string(),
                                            tier: PolicyTierSchema,
                                            description: v.string(),
                                            requiredApprovals: v.number(),
                                            requireCiPass: v.boolean(),
                                            autoCloseDelayHours: v.number(),
                                        }),
                                    ),
                                }),
                            ),
                        },
                    },
                },
            },
        }),
        async (c) => {
            return c.json({ presets: POLICY_PRESETS });
        },
    )

    // ----------------------------------------
    // Create Policy
    // ----------------------------------------
    .post(
        "/",
        describeRoute({
            tags: ["Policies"],
            summary: "Create a new policy",
            description: "Creates a custom closure policy for a workspace.",
            responses: {
                201: {
                    description: "Policy created",
                    content: {
                        "application/json": {
                            schema: resolver(PolicySchema),
                        },
                    },
                },
            },
        }),
        vValidator("json", CreatePolicySchema),
        async (c) => {
            const body = c.req.valid("json");

            // Apply preset defaults if tier is specified
            const preset = body.tier ? POLICY_PRESETS[body.tier] : POLICY_PRESETS.standard;

            const policy = {
                id: crypto.randomUUID(),
                workspaceId: body.workspaceId,
                name: body.name,
                tier: body.tier || "standard",
                description: body.description || preset.description,
                requiredApprovals: body.requiredApprovals ?? preset.requiredApprovals,
                requireCiPass: body.requireCiPass ?? preset.requireCiPass,
                autoCloseDelayHours: body.autoCloseDelayHours ?? preset.autoCloseDelayHours,
                requireAllChecksPass: body.requireAllChecksPass ?? preset.requireAllChecksPass,
                requireLinkedIssue: body.requireLinkedIssue ?? preset.requireLinkedIssue,
                isDefault: body.isDefault ?? false,
                isActive: true,
                createdAt: new Date().toISOString(),
            };

            // TODO: Save to database

            return c.json(policy, 201);
        },
    )

    // ----------------------------------------
    // Evaluate Closure Eligibility
    // ----------------------------------------
    .post(
        "/evaluate",
        describeRoute({
            tags: ["Policies"],
            summary: "Evaluate closure eligibility",
            description:
                "Checks if a task meets the requirements for optimistic closure. Returns detailed check results.",
            responses: {
                200: {
                    description: "Evaluation result",
                    content: {
                        "application/json": {
                            schema: resolver(EvaluationResultSchema),
                        },
                    },
                },
            },
        }),
        vValidator("json", EvaluateClosureSchema),
        async (c) => {
            const { taskId, workspaceId, policyId } = c.req.valid("json");

            // TODO: Fetch actual events for this task
            // TODO: Fetch policy from database or use default

            const policy = POLICY_PRESETS.standard;

            // Mock check results
            const checks = {
                prMerged: false,
                ciPassed: false,
                approvalsCount: 0,
                approvalsRequired: policy.requiredApprovals,
                allChecksPassed: false,
                linkedIssueFound: Boolean(taskId),
            };

            // Evaluate eligibility
            const eligible =
                checks.prMerged &&
                (!policy.requireCiPass || checks.ciPassed) &&
                checks.approvalsCount >= policy.requiredApprovals &&
                (!policy.requireAllChecksPass || checks.allChecksPassed) &&
                (!policy.requireLinkedIssue || checks.linkedIssueFound);

            let reason: string | undefined;
            if (!eligible) {
                if (!checks.prMerged) reason = "PR not merged";
                else if (policy.requireCiPass && !checks.ciPassed) reason = "CI not passed";
                else if (checks.approvalsCount < policy.requiredApprovals)
                    reason = `Insufficient approvals (${checks.approvalsCount}/${policy.requiredApprovals})`;
                else if (policy.requireAllChecksPass && !checks.allChecksPassed)
                    reason = "Not all checks passed";
                else if (policy.requireLinkedIssue && !checks.linkedIssueFound)
                    reason = "No linked issue found";
            }

            // Calculate scheduled close time if eligible
            const scheduledCloseAt = eligible
                ? new Date(Date.now() + policy.autoCloseDelayHours * 60 * 60 * 1000).toISOString()
                : null;

            return c.json({
                eligible,
                policyId: policyId || "preset-standard",
                policyName: policy.name,
                reason,
                checks,
                scheduledCloseAt,
            });
        },
    )

    // ----------------------------------------
    // Get Policy by ID
    // ----------------------------------------
    .get(
        "/:id",
        describeRoute({
            tags: ["Policies"],
            summary: "Get policy by ID",
            description: "Retrieves a specific closure policy.",
            responses: {
                200: {
                    description: "Policy details",
                    content: {
                        "application/json": {
                            schema: resolver(PolicySchema),
                        },
                    },
                },
                404: {
                    description: "Policy not found",
                },
            },
        }),
        async (c) => {
            const id = c.req.param("id");

            // Check preset policies
            if (id.startsWith("preset-")) {
                const tier = id.replace("preset-", "") as PolicyTier;
                if (POLICY_PRESETS[tier]) {
                    return c.json({
                        id,
                        workspaceId: "default",
                        ...POLICY_PRESETS[tier],
                        isDefault: tier === "standard",
                        isActive: true,
                        createdAt: new Date().toISOString(),
                    });
                }
            }

            // TODO: Fetch from database

            return c.json({ error: "Policy not found" }, 404);
        },
    );

export default policies;
export type PoliciesApp = typeof policies;
