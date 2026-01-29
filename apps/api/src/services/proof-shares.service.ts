/**
 * Proof Shares Service
 *
 * Database operations for public share links.
 */

import { eq } from "drizzle-orm";
import { db, schema } from "../db";

// ============================================
// Service Functions
// ============================================

/**
 * Create a share link for a proof packet
 */
export async function createShareLink(options: {
    proofId: string;
    token: string;
    expiresAt?: Date;
    createdBy?: string;
}) {
    const [share] = await db
        .insert(schema.proofShares)
        .values({
            proofId: options.proofId,
            token: options.token,
            expiresAt: options.expiresAt,
            createdBy: options.createdBy,
        })
        .returning();

    return share || null;
}

/**
 * Get share link by token
 */
export async function getShareLinkByToken(token: string) {
    const [share] = await db
        .select()
        .from(schema.proofShares)
        .where(eq(schema.proofShares.token, token))
        .limit(1);

    return share || null;
}

/**
 * Get share links for a proof
 */
export async function getShareLinksForProof(proofId: string) {
    return db.select().from(schema.proofShares).where(eq(schema.proofShares.proofId, proofId));
}

/**
 * Delete a share link
 */
export async function deleteShareLink(id: string) {
    return db.delete(schema.proofShares).where(eq(schema.proofShares.id, id));
}
