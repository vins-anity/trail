/**
 * Proofs Service
 *
 * Database operations for Proof Packets.
 * Shareable, tamper-evident delivery receipts.
 */

import { and, desc, eq, sql } from "drizzle-orm";
import type { ProofStatus } from "shared";
import { db, schema } from "../db";

// ============================================
// Types
// ============================================

export interface CreateProofPacketInput {
    workspaceId: string;
    taskId: string;
}

export interface UpdateProofPacketInput {
    status?: ProofStatus;
    aiSummary?: string;
    aiSummaryModel?: string;
    handshakeEventId?: string;
    closureEventId?: string;
    hashChainRoot?: string;
    exportedUrl?: string;
    closedAt?: Date;
}

// ============================================
// Service Functions
// ============================================

/**
 * List proof packets with filtering
 */
export async function listProofPackets(options: {
    workspaceId?: string;
    status?: ProofStatus;
    page?: number;
    pageSize?: number;
}) {
    const { workspaceId, status, page = 1, pageSize = 20 } = options;
    const offset = (page - 1) * pageSize;

    // Build conditions
    const conditions = [];
    if (workspaceId) {
        conditions.push(eq(schema.proofPackets.workspaceId, workspaceId));
    }
    if (status) {
        conditions.push(eq(schema.proofPackets.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const packets = await db
        .select()
        .from(schema.proofPackets)
        .where(whereClause)
        .orderBy(desc(schema.proofPackets.createdAt))
        .limit(pageSize)
        .offset(offset);

    // Get total count
    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.proofPackets)
        .where(whereClause);

    const total = countResult[0]?.count ?? 0;

    return {
        packets: packets.map(mapProofPacketToResponse),
        total,
        page,
        pageSize,
    };
}

/**
 * Get proof packet by ID
 */
export async function getProofPacketById(id: string) {
    const [packet] = await db
        .select()
        .from(schema.proofPackets)
        .where(eq(schema.proofPackets.id, id))
        .limit(1);

    return packet ? mapProofPacketToResponse(packet) : null;
}

/**
 * Get proof packet by task ID
 */
export async function getProofPacketByTask(taskId: string, workspaceId: string) {
    const [packet] = await db
        .select()
        .from(schema.proofPackets)
        .where(
            and(
                eq(schema.proofPackets.taskId, taskId),
                eq(schema.proofPackets.workspaceId, workspaceId),
            ),
        )
        .limit(1);

    return packet || null;
}

/**
 * Create a new proof packet (draft)
 */
export async function createProofPacket(input: CreateProofPacketInput) {
    const [packet] = await db
        .insert(schema.proofPackets)
        .values({
            workspaceId: input.workspaceId,
            taskId: input.taskId,
            status: "draft",
        })
        .returning();

    if (!packet) {
        throw new Error("Failed to create proof packet");
    }

    return packet;
}

/**
 * Update proof packet
 */
export async function updateProofPacket(id: string, input: UpdateProofPacketInput) {
    const [packet] = await db
        .update(schema.proofPackets)
        .set({
            ...input,
            updatedAt: new Date(),
        })
        .where(eq(schema.proofPackets.id, id))
        .returning();

    return packet || null;
}

/**
 * Get or create proof packet for a task
 */
export async function getOrCreateProofPacket(taskId: string, workspaceId: string) {
    // Try to find existing
    let packet = await getProofPacketByTask(taskId, workspaceId);

    if (!packet) {
        // Create new draft
        packet = await createProofPacket({ workspaceId, taskId });
    }

    return packet;
}

/**
 * Finalize proof packet (mark as closed)
 */
// Finalize proof packet (mark as closed and seal hash chain)
export async function finalizeProofPacket(id: string, closureEventId: string) {
    const packet = await getProofPacketById(id);
    if (!packet) throw new Error("Packet not found");

    // Fetch the closure event to get its hash
    const { eventsService } = await import("../services");
    const closureEvent = await eventsService.getEventById(closureEventId);

    // The "Root" of the proof is the hash of the closure event,
    // which cryptographically links to all previous events (handshake, PRs, etc.)
    const hashChainRoot = closureEvent?.eventHash || "broken-chain-error";

    return updateProofPacket(id, {
        status: "finalized",
        closureEventId,
        hashChainRoot,
        closedAt: new Date(),
    });
}

// ============================================
// Helpers
// ============================================

function mapProofPacketToResponse(packet: schema.ProofPacket) {
    return {
        id: packet.id,
        workspaceId: packet.workspaceId,
        taskId: packet.taskId,
        status: packet.status,
        aiSummary: packet.aiSummary,
        aiSummaryModel: packet.aiSummaryModel,
        handshakeEventId: packet.handshakeEventId,
        closureEventId: packet.closureEventId,
        hashChainRoot: packet.hashChainRoot,
        exportedUrl: packet.exportedUrl,
        closedAt: packet.closedAt?.toISOString() || null,
        createdAt: packet.createdAt.toISOString(),
        updatedAt: packet.updatedAt.toISOString(),
    };
}

/**
 * Get workspace for a proof packet (used for finding integration settings)
 */
export async function getWorkspaceForProof(workspaceId: string) {
    const { workspacesService } = await import("../services");
    return workspacesService.getWorkspaceById(workspaceId);
}
