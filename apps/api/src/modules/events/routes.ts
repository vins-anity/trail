import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as vValidator } from "hono-openapi/valibot";
import { ChainVerificationSchema, EventListSchema, EventQuerySchema, EventSchema } from "shared";
import * as v from "valibot";
import { isValidUUID } from "../../lib/error";
import { supabaseAuth } from "../../middleware/supabase-auth";
import { requireWorkspaceAccess } from "../../middleware/workspace-guard";
import * as eventsService from "../../services/events.service";

/**
 * Events Module
 *
 * Hash-chained event log for tamper-evident audit trail.
 * Provides endpoints to query and verify the event chain.
 *
 * @see Section 5.5 in thesis: "Data Integrity: Hash-Chained Event Log"
 */

// ============================================
// Routes
// ============================================

const events = new Hono();

// Apply Auth Middleware
events.use("*", supabaseAuth);

events
    .get(
        "/",
        requireWorkspaceAccess(), // Enforce workspace context for listing events
        describeRoute({
            tags: ["Events"],
            summary: "List events with pagination",
            description:
                "Returns hash-chained events from the audit log. Supports filtering by workspace, task, and event type.",
            responses: {
                200: {
                    description: "List of events",
                    content: {
                        "application/json": {
                            schema: resolver(EventListSchema),
                        },
                    },
                },
            },
        }),
        vValidator("query", EventQuerySchema),
        async (c) => {
            const query = c.req.valid("query");

            const result = await eventsService.listEvents({
                workspaceId: query.workspaceId,
                taskId: query.taskId,
                eventType: query.eventType,
                page: query.page || 1,
                pageSize: Math.min(query.pageSize || 20, 100),
            });

            return c.json(result);
        },
    )

    // ----------------------------------------
    // Dashboard Stats
    // ----------------------------------------
    .get("/stats", async (c) => {
        const workspaceId = c.req.query("workspaceId");
        const stats = await eventsService.getDashboardStats(workspaceId);
        return c.json(stats);
    })

    // ----------------------------------------
    // Get Single Event
    // ----------------------------------------
    .get(
        "/:id",
        describeRoute({
            tags: ["Events"],
            summary: "Get event by ID",
            description: "Retrieves a specific event with hash chain verification info",
            responses: {
                200: {
                    description: "Event details",
                    content: {
                        "application/json": {
                            schema: resolver(EventSchema),
                        },
                    },
                },
                404: {
                    description: "Event not found",
                },
            },
        }),
        async (c) => {
            const id = c.req.param("id");

            // Validate UUID format
            if (!isValidUUID(id)) {
                return c.json({ error: "Event not found" }, 404);
            }

            const event = await eventsService.getEventById(id);

            if (!event) {
                return c.json({ error: "Event not found" }, 404);
            }

            return c.json(event);
        },
    )

    // ----------------------------------------
    // Verify Chain Integrity
    // ----------------------------------------
    // ----------------------------------------
    // Verify Chain Integrity
    // ----------------------------------------
    .get(
        "/verify/:workspaceId",
        requireWorkspaceAccess(),
        describeRoute({
            tags: ["Events"],
            summary: "Verify hash chain integrity",
            description:
                "Verifies the hash chain for a workspace to detect any tampering. Returns validation result with error details.",
            responses: {
                200: {
                    description: "Chain verification result",
                    content: {
                        "application/json": {
                            schema: resolver(ChainVerificationSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const workspaceId = c.req.param("workspaceId");

            const result = await eventsService.verifyWorkspaceChain(workspaceId);

            return c.json(result);
        },
    )

    // ----------------------------------------
    // Get Events for Task
    // ----------------------------------------
    .get(
        "/task/:taskId",
        describeRoute({
            tags: ["Events"],
            summary: "Get events for a task",
            description:
                "Returns all events associated with a specific task (Jira issue key) in chronological order.",
            responses: {
                200: {
                    description: "Task events",
                    content: {
                        "application/json": {
                            schema: resolver(
                                v.object({
                                    taskId: v.string(),
                                    events: v.array(EventSchema),
                                    summary: v.object({
                                        handshakeAt: v.optional(v.nullable(v.string())),
                                        closedAt: v.optional(v.nullable(v.string())),
                                        prCount: v.number(),
                                        approvalCount: v.number(),
                                        ciPassed: v.boolean(),
                                    }),
                                }),
                            ),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const taskId = c.req.param("taskId");

            const result = await eventsService.getEventsByTask(taskId);

            return c.json(result);
        },
    );

export default events;
export type EventsApp = typeof events;
