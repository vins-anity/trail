/**
 * Events Service
 *
 * Database operations for hash-chained event logging.
 * Uses Drizzle ORM for type-safe queries.
 */

import { and, desc, eq, sql } from "drizzle-orm";
import type { EventType, TriggerSource } from "shared";
import { db, schema } from "../db";
import { createHashedEvent, verifyChainIntegrity } from "../lib/hash-chain";

// ============================================
// Types
// ============================================

export interface CreateEventInput {
    eventType: EventType;
    triggerSource?: TriggerSource;
    payload: Record<string, unknown>;
    workspaceId: string;
    taskId?: string;
    proofPacketId?: string;
}

export interface ListEventsOptions {
    workspaceId?: string;
    taskId?: string;
    eventType?: string;
    page?: number;
    pageSize?: number;
}

// ============================================
// Service Functions
// ============================================

/**
 * List events with pagination and filtering
 */
export async function listEvents(options: ListEventsOptions) {
    const { workspaceId, taskId, eventType, page = 1, pageSize = 20 } = options;
    const offset = (page - 1) * pageSize;

    // Build where conditions
    const conditions = [];
    if (workspaceId) conditions.push(eq(schema.events.workspaceId, workspaceId));
    if (taskId) conditions.push(eq(schema.events.taskId, taskId));
    if (eventType)
        conditions.push(eq(schema.events.eventType, eventType as schema.Event["eventType"]));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Query events
    const events = await db
        .select()
        .from(schema.events)
        .where(whereClause)
        .orderBy(desc(schema.events.createdAt))
        .limit(pageSize)
        .offset(offset);

    // Get total count
    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.events)
        .where(whereClause);

    const total = countResult[0]?.count ?? 0;

    return {
        events: events.map(mapEventToResponse),
        total,
        page,
        pageSize,
        hasMore: offset + events.length < total,
    };
}

/**
 * Get a single event by ID
 */
export async function getEventById(id: string) {
    const [event] = await db.select().from(schema.events).where(eq(schema.events.id, id)).limit(1);

    return event ? mapEventToResponse(event) : null;
}

/**
 * Get events for a specific task
 */
export async function getEventsByTask(taskId: string) {
    const events = await db
        .select()
        .from(schema.events)
        .where(eq(schema.events.taskId, taskId))
        .orderBy(schema.events.createdAt);

    // Build summary
    const summary = {
        handshakeAt: null as string | null,
        closedAt: null as string | null,
        prCount: 0,
        approvalCount: 0,
        ciPassed: false,
    };

    for (const event of events) {
        if (event.eventType === "handshake") {
            summary.handshakeAt = event.createdAt.toISOString();
        }
        if (event.eventType === "closure_approved") {
            summary.closedAt = event.createdAt.toISOString();
        }
        if (event.eventType === "pr_opened" || event.eventType === "pr_merged") {
            summary.prCount++;
        }
        if (event.eventType === "pr_approved") {
            summary.approvalCount++;
        }
        if (event.eventType === "ci_passed") {
            summary.ciPassed = true;
        }
    }

    return {
        taskId,
        events: events.map(mapEventToResponse),
        summary,
    };
}

/**
 * Create a new hash-chained event
 */
export async function createEvent(input: CreateEventInput) {
    // Create hashed event data
    const eventData = await createHashedEvent(
        {
            eventType: input.eventType,
            triggerSource: input.triggerSource,
            payload: input.payload,
            workspaceId: input.workspaceId,
            taskId: input.taskId,
            proofPacketId: input.proofPacketId,
        },
        db,
    );

    // Insert into database
    const [event] = await db.insert(schema.events).values(eventData).returning();

    if (!event) {
        throw new Error("Failed to create event");
    }

    return mapEventToResponse(event);
}

/**
 * Verify hash chain integrity for a workspace
 */
export async function verifyWorkspaceChain(workspaceId: string) {
    const events = await db
        .select()
        .from(schema.events)
        .where(eq(schema.events.workspaceId, workspaceId))
        .orderBy(schema.events.createdAt);

    return verifyChainIntegrity(events);
}

/**
 * Get dashboard statistics
 * @param workspaceId - Optional filter by workspace
 * @returns Active tasks count (handshakes without corresponding closures)
 */
export async function getDashboardStats(workspaceId?: string) {
    try {
        const filters = workspaceId ? eq(schema.events.workspaceId, workspaceId) : undefined;

        // 1. Active Tasks (Handshakes without closure)
        // Handshakes
        const handshakes = await db
            .selectDistinct({ taskId: schema.events.taskId })
            .from(schema.events)
            .where(and(filters, eq(schema.events.eventType, "handshake")));

        // Finalized closures (approved)
        const closures = await db
            .selectDistinct({ taskId: schema.events.taskId })
            .from(schema.events)
            .where(and(filters, eq(schema.events.eventType, "closure_approved")));

        const closedTaskIds = new Set(closures.map((c) => c.taskId).filter(Boolean));
        const activeTasks = handshakes.filter(
            (h) => h.taskId && !closedTaskIds.has(h.taskId),
        ).length;

        // 2. Pending Proofs (closure_proposed but not finalized or vetoed)
        // This is simplified: count events where eventType = closure_proposed
        // AND not followed by closure_approved or closure_vetoed for same task/proof
        // For MVP speed, let's just count 'closure_proposed' events within last 24h that aren't closed?
        // Better: Query existing pending jobs from pg-boss?
        // Alternative: Just count closure_proposed events that don't have a matching closure_approved/vetoed
        // Let's go with the query approach similar to active tasks.

        const proposed = await db
            .selectDistinct({ taskId: schema.events.taskId })
            .from(schema.events)
            .where(and(filters, eq(schema.events.eventType, "closure_proposed")));

        const vetoed = await db
            .selectDistinct({ taskId: schema.events.taskId })
            .from(schema.events)
            .where(and(filters, eq(schema.events.eventType, "closure_vetoed")));

        const finalizedTaskIds = new Set(
            [...closures, ...vetoed].map((c) => c.taskId).filter(Boolean),
        );

        const pendingProofs = proposed.filter(
            (p) => p.taskId && !finalizedTaskIds.has(p.taskId),
        ).length;

        // 3. Completed Proofs (closure_approved)
        const completedProofs = closures.length;

        // 4. Vetoed (closure_vetoed)
        const vetoedCount = vetoed.length;

        return {
            activeTasks,
            pendingProofs,
            completedProofs,
            vetoed: vetoedCount,
        };
    } catch (error) {
        console.error("DEBUG: Error in getDashboardStats:", error);
        throw error;
    }
}

// ============================================
// Helpers
// ============================================

/**
 * Mark a handshake event as rejected
 */
export async function rejectHandshake(eventId: string, userId: string) {
    const [updated] = await db
        .update(schema.events)
        .set({
            rejectedBy: userId,
            rejectedAt: new Date(),
        })
        .where(eq(schema.events.id, eventId))
        .returning();

    if (!updated) {
        throw new Error(`Event ${eventId} not found`);
    }

    console.log(`Handshake rejected: event=${eventId}, user=${userId}`);
    return mapEventToResponse(updated);
}

/**
 * Mark an optimistic closure as vetoed
 */
export async function vetoOptimisticClosure(closureJobId: string, userId: string) {
    // Update the closure event
    const [updated] = await db
        .update(schema.events)
        .set({
            vetoedBy: userId,
            vetoedAt: new Date(),
        })
        .where(eq(schema.events.id, closureJobId))
        .returning();

    if (!updated) {
        throw new Error(`Closure event ${closureJobId} not found`);
    }

    console.log(`Closure vetoed: event=${closureJobId}, user=${userId}`);
    return mapEventToResponse(updated);
}

function mapEventToResponse(event: schema.Event) {
    return {
        id: event.id,
        eventType: event.eventType,
        triggerSource: event.triggerSource,
        prevHash: event.prevHash,
        eventHash: event.eventHash,
        payload: event.payload,
        workspaceId: event.workspaceId,
        taskId: event.taskId,
        rejectedBy: event.rejectedBy,
        rejectedAt: event.rejectedAt?.toISOString(),
        vetoedBy: event.vetoedBy,
        vetoedAt: event.vetoedAt?.toISOString(),
        createdAt: event.createdAt.toISOString(),
    };
}

/**
 * Get audit log for valid chain visualization
 */
export async function getAuditLog(workspaceId: string, limit = 50) {
    const events = await db
        .select()
        .from(schema.events)
        .where(eq(schema.events.workspaceId, workspaceId))
        .orderBy(desc(schema.events.createdAt))
        .limit(limit);

    return events.map(mapEventToResponse);
}
