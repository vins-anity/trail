/**
 * Hash Chain Utilities
 *
 * Implements tamper-evident hash chaining for the event log.
 * Each event's hash includes the previous event's hash, creating
 * a blockchain-like structure that detects any modifications.
 *
 * Algorithm: SHA-256
 *
 * @see Section 5.5 in thesis: "Data Integrity: Hash-Chained Event Log"
 */

import type { Event, NewEvent } from "../db/schema";

/**
 * Event payload structure for hashing
 */
interface HashableEvent {
    eventType: string;
    triggerSource: string | null;
    payload: Record<string, unknown>;
    workspaceId: string;
    taskId?: string | null;
    createdAt: Date | string;
}

/**
 * Computes SHA-256 hash of an event with previous hash linkage.
 *
 * The hash includes:
 * - Previous event hash (or "genesis" for first event)
 * - Event type
 * - Trigger source
 * - Serialized payload
 * - Workspace ID
 * - Task ID (if present)
 * - Timestamp
 *
 * @param event - The event to hash
 * @param prevHash - Hash of the previous event (null for genesis)
 * @returns SHA-256 hash as hex string
 */
export async function computeEventHash(
    event: HashableEvent,
    prevHash: string | null,
): Promise<string> {
    const hashInput = JSON.stringify({
        prevHash: prevHash ?? "genesis",
        eventType: event.eventType,
        triggerSource: event.triggerSource ?? "automatic",
        payload: event.payload,
        workspaceId: event.workspaceId,
        taskId: event.taskId ?? null,
        createdAt:
            typeof event.createdAt === "string" ? event.createdAt : event.createdAt.toISOString(),
    });

    // Use Web Crypto API (available in Bun)
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies the integrity of an event chain.
 *
 * Checks that:
 * 1. Each event's prevHash matches the previous event's eventHash
 * 2. Each event's hash is correctly computed
 *
 * @param events - Array of events in chronological order
 * @returns Verification result with details
 */
export async function verifyChainIntegrity(events: Event[]): Promise<ChainVerificationResult> {
    if (events.length === 0) {
        return { valid: true, errors: [], verifiedCount: 0 };
    }

    const errors: ChainError[] = [];
    let prevHash: string | null = null;

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (!event) continue;

        // Check prevHash linkage
        if (event.prevHash !== prevHash) {
            errors.push({
                eventId: event.id,
                index: i,
                type: "broken_link",
                message: `Event ${i} has prevHash "${event.prevHash}" but expected "${prevHash}"`,
            });
        }

        // Verify event hash
        const computedHash = await computeEventHash(
            {
                eventType: event.eventType,
                triggerSource: event.triggerSource,
                payload: event.payload as Record<string, unknown>,
                workspaceId: event.workspaceId,
                taskId: event.taskId,
                createdAt: event.createdAt,
            },
            event.prevHash,
        );

        if (computedHash !== event.eventHash) {
            errors.push({
                eventId: event.id,
                index: i,
                type: "invalid_hash",
                message: `Event ${i} hash mismatch: computed "${computedHash}" but stored "${event.eventHash}"`,
            });
        }

        prevHash = event.eventHash;
    }

    return {
        valid: errors.length === 0,
        errors,
        verifiedCount: events.length,
    };
}

/**
 * Gets the latest event hash for a workspace to use as prevHash.
 *
 * @param workspaceId - The workspace to query
 * @param db - Database instance
 * @returns Latest event hash or null if no events exist
 */
export async function getLatestEventHash(
    workspaceId: string,
    // biome-ignore lint/suspicious/noExplicitAny: Flexible db type for different Drizzle instances
    db: any,
): Promise<string | null> {
    const { events } = await import("../db/schema");
    const { desc, eq } = await import("drizzle-orm");

    const result = await db
        .select({ eventHash: events.eventHash })
        .from(events)
        .where(eq(events.workspaceId, workspaceId))
        .orderBy(desc(events.createdAt))
        .limit(1);

    return result[0]?.eventHash ?? null;
}

/**
 * Creates a new event with proper hash chaining.
 *
 * This is the preferred way to create events as it handles:
 * - Fetching the previous hash
 * - Computing the new event hash
 * - Returning a complete NewEvent object
 *
 * @param eventData - Partial event data (without hash fields)
 * @param db - Database instance
 * @returns NewEvent with computed hashes
 */
export async function createHashedEvent(
    eventData: Omit<NewEvent, "id" | "prevHash" | "eventHash" | "createdAt">,
    // biome-ignore lint/suspicious/noExplicitAny: Flexible db type
    db: any,
): Promise<NewEvent> {
    const prevHash = await getLatestEventHash(eventData.workspaceId, db);
    const createdAt = new Date();

    const eventHash = await computeEventHash(
        {
            eventType: eventData.eventType,
            triggerSource: eventData.triggerSource ?? null,
            payload: eventData.payload,
            workspaceId: eventData.workspaceId,
            taskId: eventData.taskId,
            createdAt,
        },
        prevHash,
    );

    return {
        ...eventData,
        prevHash,
        eventHash,
        createdAt,
    };
}

// ============================================
// Types
// ============================================

export interface ChainVerificationResult {
    valid: boolean;
    errors: ChainError[];
    verifiedCount: number;
}

export interface ChainError {
    eventId: string;
    index: number;
    type: "broken_link" | "invalid_hash";
    message: string;
}
