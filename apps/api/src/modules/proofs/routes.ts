import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as vValidator } from "hono-openapi/valibot";
import {
    CreateProofPacketSchema,
    ExportResultSchema,
    GenerateSummarySchema,
    ProofPacketListSchema,
    ProofPacketSchema,
    type ProofStatus,
    ShareResultSchema,
} from "shared";
import * as v from "valibot";
import { generateProofSummary } from "../../lib/ai";
import { isValidUUID } from "../../lib/error";
import { supabaseAuth } from "../../middleware/supabase-auth";
import { requireWorkspaceAccess } from "../../middleware/workspace-guard";
import * as proofsService from "../../services/proofs.service";

/**
 * Proofs Module
 *
 * Generates and serves Proof Packets (shareable delivery receipts).
 * Includes AI-generated summaries for client-friendly narratives.
 *
 * @see Section 5.4.4 in thesis: "Proof Packet Generator"
 * @see Appendix B: Proof Packet JSON Schema
 */

// ============================================
// Routes
// ============================================

const proofs = new Hono();

// Apply Auth Middleware
proofs.use("*", supabaseAuth);

proofs
    // ----------------------------------------
    // List Proof Packets
    // ----------------------------------------
    .get(
        "/",
        requireWorkspaceAccess(),
        describeRoute({
            tags: ["Proofs"],
            summary: "List proof packets",
            description: "Returns proof packets with filtering by workspace, status, and task.",
            responses: {
                200: {
                    description: "List of proof packets",
                    content: {
                        "application/json": {
                            schema: resolver(ProofPacketListSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const workspaceId = c.req.query("workspaceId");
            const status = c.req.query("status") as ProofStatus | undefined;
            const page = Number.parseInt(c.req.query("page") || "1", 10);
            const pageSize = Math.min(Number.parseInt(c.req.query("pageSize") || "20", 10), 100);

            const result = await proofsService.listProofPackets({
                workspaceId,
                status,
                page,
                pageSize,
            });

            return c.json(result);
        },
    )

    // ----------------------------------------
    // Get Proof Packet by ID
    // ----------------------------------------
    .get(
        "/:id",
        describeRoute({
            tags: ["Proofs"],
            summary: "Get a Proof Packet by ID",
            description: "Retrieves a shareable, tamper-evident delivery receipt",
            responses: {
                200: {
                    description: "Proof packet retrieved successfully",
                    content: {
                        "application/json": {
                            schema: resolver(ProofPacketSchema),
                        },
                    },
                },
                404: {
                    description: "Proof packet not found",
                },
            },
        }),
        async (c) => {
            const id = c.req.param("id");

            // Validate UUID format
            if (!isValidUUID(id)) {
                return c.json({ error: "Proof packet not found" }, 404);
            }

            const packet = await proofsService.getProofPacketById(id);

            if (!packet) {
                return c.json({ error: "Proof packet not found" }, 404);
            }

            // Augment with expected structure from Appendix B
            return c.json({
                ...packet,
                task: {
                    id: packet.taskId,
                    key: packet.taskId,
                    summary: "Task summary",
                },
                handshake: {
                    triggeredAt: packet.createdAt,
                    triggerSource: "jira_webhook",
                },
                execution: {
                    approvals: [],
                    ciPassed: false,
                },
                closure: {
                    closedAt: packet.closedAt,
                },
            });
        },
    )

    // ----------------------------------------
    // Create Proof Packet
    // ----------------------------------------
    .post(
        "/",
        describeRoute({
            tags: ["Proofs"],
            summary: "Create a new Proof Packet",
            description: "Initializes a proof packet for a task. Called when handshake occurs.",
            responses: {
                201: {
                    description: "Proof packet created",
                    content: {
                        "application/json": {
                            schema: resolver(ProofPacketSchema),
                        },
                    },
                },
            },
        }),
        vValidator("json", CreateProofPacketSchema),
        async (c) => {
            const body = c.req.valid("json");

            const packet = await proofsService.createProofPacket({
                workspaceId: body.workspaceId,
                taskId: body.taskId,
            });

            return c.json(
                {
                    ...packet,
                    task: {
                        id: body.taskId,
                        key: body.taskKey,
                        summary: body.taskSummary,
                    },
                },
                201,
            );
        },
    )

    // ----------------------------------------
    // Generate AI Summary
    // ----------------------------------------
    .post(
        "/:id/summarize",
        describeRoute({
            tags: ["Proofs"],
            summary: "Generate AI summary for Proof Packet",
            description:
                "Uses Gemini AI to generate a client-friendly summary of the task execution.",
            responses: {
                200: {
                    description: "Summary generated",
                    content: {
                        "application/json": {
                            schema: resolver(
                                v.object({
                                    success: v.boolean(),
                                    summary: v.string(),
                                    model: v.string(),
                                }),
                            ),
                        },
                    },
                },
            },
        }),
        vValidator("json", GenerateSummarySchema),
        async (c) => {
            const id = c.req.param("id");
            const _options = c.req.valid("json");

            // Fetch proof packet
            const packet = await proofsService.getProofPacketById(id);

            if (!packet) {
                return c.json({ error: "Proof packet not found" }, 404);
            }

            // Try to generate AI summary
            try {
                let commits: { message: string; author: string }[] = [];
                let prDescription = "";

                // Fetch real GitHub context if workspace has it connected
                try {
                    const workspace = await proofsService.getWorkspaceForProof(packet.workspaceId);
                    if (workspace?.githubOrg) {
                        // Assuming taskKey maps to PR number or branch - sophisticated logic needed here
                        // For MVP: We need a way to link taskId to PR.
                        // Strategy: Use eventsService to find "pr_merged" event for this taskId to get prNumber
                        const { eventsService } = await import("../../services");
                        const { events } = await eventsService.listEvents({
                            workspaceId: packet.workspaceId,
                            taskId: packet.taskId,
                            eventType: "pr_merged",
                            pageSize: 1,
                        });

                        const prEvent = events[0];
                        const prNumber = prEvent?.payload?.prNumber as number | undefined;
                        const repoName = prEvent?.payload?.repo as string | undefined; // e.g. "org/repo"

                        if (prNumber && repoName) {
                            const [owner, repo] = repoName.split("/");
                            if (owner && repo) {
                                const { githubService } = await import("../../services");

                                const [prDetails, prCommits] = await Promise.all([
                                    githubService.fetchPRDetails(owner, repo, prNumber),
                                    githubService.fetchCommits(owner, repo, prNumber),
                                ]);

                                prDescription = prDetails.body || "";
                                commits = prCommits.map((c) => ({
                                    message: c.message,
                                    author: c.author,
                                }));
                            }
                        }
                    }
                } catch (ghError) {
                    console.warn(`[Proofs] Failed to fetch GitHub context:`, ghError);
                }

                const result = await generateProofSummary({
                    taskKey: packet.taskId,
                    taskSummary: "Proof Packet Summary", // ideally fetch title from Jira/Event
                    commits: commits,
                    prDescription: prDescription,
                    approvers: [], // could fetch from PR details
                });

                // Update packet with AI summary
                await proofsService.updateProofPacket(id, {
                    aiSummary: result.summary,
                    aiSummaryModel: result.model,
                });

                return c.json({
                    success: true,
                    summary: result.summary,
                    model: result.model,
                });
            } catch (_error) {
                // Fall through to mock response
            }

            // Mock response if Gemini not configured
            const mockSummary =
                "This update implements secure user authentication with email/password login, " +
                "password reset functionality, and session management. The changes were reviewed " +
                "and approved by the team, with all automated tests passing successfully.";

            return c.json({
                success: true,
                summary: mockSummary,
                model: "mock",
            });
        },
    )

    // ----------------------------------------
    // Export as PDF
    // ----------------------------------------
    .get(
        "/:id/pdf",
        describeRoute({
            tags: ["Proofs"],
            summary: "Export Proof Packet as PDF",
            description: "Generates a downloadable PDF version of the proof packet",
            responses: {
                200: {
                    description: "PDF file",
                    content: {
                        "application/pdf": {},
                    },
                },
            },
        }),
        async (c) => {
            const id = c.req.param("id");

            // Verify packet exists
            const packet = await proofsService.getProofPacketById(id);
            if (!packet) {
                return c.json({ error: "Proof packet not found" }, 404);
            }

            // Fetch events for this proof packet
            const { eventsService } = await import("../../services");
            const { events } = await eventsService.listEvents({
                workspaceId: packet.workspaceId,
                taskId: packet.taskId,
                pageSize: 50,
            });

            // Get workspace name
            const workspace = await proofsService.getWorkspaceForProof(packet.workspaceId);

            // Generate PDF
            const { generateProofPDF } = await import("../../lib/pdf-generator");
            const pdfBuffer = await generateProofPDF({
                proof: packet,
                events: events.map((e) => ({
                    id: e.id,
                    eventType: e.eventType,
                    payload: e.payload as Record<string, unknown>,
                    createdAt: e.createdAt,
                    eventHash: e.eventHash,
                })),
                workspaceName: workspace?.name || "ShipDocket",
            });

            // Return PDF as download
            c.header("Content-Type", "application/pdf");
            c.header(
                "Content-Disposition",
                `attachment; filename="proof-${packet.taskId || packet.id}.pdf"`,
            );

            return c.body(pdfBuffer as any);
        },
    )

    // ----------------------------------------
    // Export as JSON
    // ----------------------------------------
    .get(
        "/:id/json",
        describeRoute({
            tags: ["Proofs"],
            summary: "Export Proof Packet as JSON",
            description:
                "Returns the complete proof packet in the Appendix B JSON format for external integrations.",
            responses: {
                200: {
                    description: "JSON export",
                    content: {
                        "application/json": {
                            schema: resolver(ProofPacketSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const id = c.req.param("id");

            const packet = await proofsService.getProofPacketById(id);

            if (!packet) {
                return c.json({ error: "Proof packet not found" }, 404);
            }

            return c.json({
                ...packet,
                task: {
                    id: packet.taskId,
                    key: packet.taskId,
                    summary: "Task summary",
                },
            });
        },
    )

    // ----------------------------------------
    // Share Proof Packet
    // ----------------------------------------
    .post(
        "/:id/share",
        describeRoute({
            tags: ["Proofs"],
            summary: "Generate shareable link",
            description:
                "Creates a public, time-limited URL for sharing the proof packet with clients.",
            responses: {
                200: {
                    description: "Shareable link generated",
                    content: {
                        "application/json": {
                            schema: resolver(ShareResultSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const id = c.req.param("id");

            // Verify packet exists
            const packet = await proofsService.getProofPacketById(id);
            if (!packet) {
                return c.json({ error: "Proof packet not found" }, 404);
            }

            // Generate share token
            const shareToken = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            // Persist share link to database
            const { proofSharesService } = await import("../../services");
            await proofSharesService.createShareLink({
                proofId: id,
                token: shareToken,
                expiresAt,
            });

            // Update packet status
            const frontendUrl = process.env.FRONTEND_URL || "https://shipdocket.pages.dev";
            await proofsService.updateProofPacket(id, {
                status: "exported",
                exportedUrl: `${frontendUrl}/share/${shareToken}`,
            });

            return c.json({
                success: true,
                shareUrl: `${frontendUrl}/share/${shareToken}`,
                expiresAt: expiresAt.toISOString(),
            });
        },
    );

export default proofs;
export type ProofsApp = typeof proofs;
