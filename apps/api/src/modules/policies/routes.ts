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
import { isValidUUID } from "../../lib/error";
import * as policiesService from "../../services/policies.service";

/**
 * Policies Module
 *
 * Manages closure policies and the Optimistic Closure Engine.
 * 3-tier system: Agile, Standard, Hardened
 *
 * @see Section 5.4.3 in thesis: "Policy & Optimistic Engine"
 */

// Re-export POLICY_PRESETS from service for use in routes
const { POLICY_PRESETS } = policiesService;

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

            // Fetch from database
            const dbPolicies = await policiesService.listPolicies(workspaceId);

            // If no policies in DB, return presets
            if (dbPolicies.length === 0) {
                const now = new Date().toISOString();
                const presetList = Object.values(POLICY_PRESETS).map((preset, index) => ({
                    id: `preset-${preset.tier}`,
                    workspaceId: workspaceId || "default",
                    ...preset,
                    isDefault: index === 1,
                    isActive: true,
                    createdAt: now,
                }));
                return c.json({ policies: presetList });
            }

            return c.json({
                policies: dbPolicies.map(policiesService.mapPolicyToResponse),
            });
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

            const policy = await policiesService.createPolicy({
                workspaceId: body.workspaceId,
                name: body.name,
                tier: body.tier,
                description: body.description,
                requiredApprovals: body.requiredApprovals,
                requireCiPass: body.requireCiPass,
                autoCloseDelayHours: body.autoCloseDelayHours,
                requireAllChecksPass: body.requireAllChecksPass,
                requireLinkedIssue: body.requireLinkedIssue,
                isDefault: body.isDefault,
            });

            if (!policy) {
                return c.json({ error: "Failed to create policy" }, 500);
            }

            return c.json(policiesService.mapPolicyToResponse(policy), 201);
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

            // Get policy (use standard preset as fallback)
            const policy = policyId
                ? await policiesService.getPolicyById(policyId)
                : await policiesService.getDefaultPolicy(workspaceId);

            const policyRules = policy || POLICY_PRESETS.standard;

            // TODO: Fetch actual events for this task to determine real check status
            // For now, return mock check results
            const checks = {
                prMerged: false,
                ciPassed: false,
                approvalsCount: 0,
                approvalsRequired: policyRules.requiredApprovals,
                allChecksPassed: false,
                linkedIssueFound: Boolean(taskId),
            };

            const result = await policiesService.evaluateClosure(
                { taskId, workspaceId, policyId },
                checks,
            );

            return c.json(result);
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
                return c.json({ error: "Policy not found" }, 404);
            }

            // Validate UUID format before querying
            if (!isValidUUID(id)) {
                return c.json({ error: "Policy not found" }, 404);
            }

            // Fetch from database
            const policy = await policiesService.getPolicyById(id);

            if (!policy) {
                return c.json({ error: "Policy not found" }, 404);
            }

            return c.json(policiesService.mapPolicyToResponse(policy));
        },
    );

export default policies;
export type PoliciesApp = typeof policies;
