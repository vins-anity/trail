/**
 * Workspaces Service
 *
 * Database operations for multi-tenant workspace management.
 * Provides lookup by integration IDs (Slack, GitHub, Jira).
 *
 * Security: OAuth tokens are encrypted at rest using AES-256-GCM.
 */

import { and, eq, or } from "drizzle-orm";
import type { PolicyTier } from "shared";
import { db, schema } from "../db";
import type { Workspace } from "../db/schema";
import { decryptToken, encryptToken } from "../lib/token-encryption";

// ============================================
// Types
// ============================================

export interface CreateWorkspaceInput {
    name: string;
    defaultPolicyTier?: PolicyTier;
    userId: string;
}

export interface UpdateWorkspaceInput {
    name?: string;
    slackTeamId?: string;
    slackAccessToken?: string;
    githubOrg?: string;
    githubInstallationId?: string;
    jiraSite?: string;
    jiraAccessToken?: string;
    defaultPolicyTier?: PolicyTier;
    workflowSettings?: {
        startTracking: string[];
        reviewStatus: string[];
        doneStatus: string[];
    };
    proofPacketRules?: {
        autoCreateOnDone: boolean;
        minEventsForProof: number;
        excludedTaskTypes: string[];
    };
    onboardingCompletedAt?: Date;
}

// ... (abbreviated for brevity, assuming existing code is fine)

/**
 * Verify if a user has access to a workspace
 */
export async function checkAccess(userId: string, workspaceId: string) {
    const member = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(schema.workspaceMembers.workspaceId, workspaceId),
            eq(schema.workspaceMembers.userId, userId),
        ),
    });
    return !!member;
}

/**
 * Get all members of a workspace
 */
export async function getWorkspaceMembers(workspaceId: string) {
    const members = await db.query.workspaceMembers.findMany({
        where: eq(schema.workspaceMembers.workspaceId, workspaceId),
    });

    return members;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Decrypt workspace tokens after DB read
 * Gracefully handles decryption failures by returning null for failed tokens
 */
async function decryptWorkspaceTokens(workspace: Workspace): Promise<Workspace> {
    const result = { ...workspace };

    try {
        if (result.slackAccessToken) {
            result.slackAccessToken = await decryptToken(result.slackAccessToken);
        }
    } catch (e) {
        console.warn(`Failed to decrypt slackAccessToken for workspace ${workspace.id}`);
        result.slackAccessToken = null;
    }

    try {
        if (result.githubInstallationId) {
            result.githubInstallationId = await decryptToken(result.githubInstallationId);
        }
    } catch (e) {
        console.warn(`Failed to decrypt githubInstallationId for workspace ${workspace.id}`);
        result.githubInstallationId = null;
    }

    try {
        if (result.jiraAccessToken) {
            result.jiraAccessToken = await decryptToken(result.jiraAccessToken);
        }
    } catch (e) {
        console.warn(`Failed to decrypt jiraAccessToken for workspace ${workspace.id}`);
        result.jiraAccessToken = null;
    }

    return result;
}

/**
 * Encrypt workspace tokens before DB write
 */
async function encryptWorkspaceTokens(input: UpdateWorkspaceInput) {
    const encrypted = { ...input };

    if (encrypted.slackAccessToken) {
        encrypted.slackAccessToken = await encryptToken(encrypted.slackAccessToken);
    }
    if (encrypted.githubInstallationId) {
        encrypted.githubInstallationId = await encryptToken(encrypted.githubInstallationId);
    }
    if (encrypted.jiraAccessToken) {
        encrypted.jiraAccessToken = await encryptToken(encrypted.jiraAccessToken);
    }

    return encrypted;
}

// ============================================
// Service Functions
// ============================================

/**
 * Get workspace by ID
 */
export async function getWorkspaceById(id: string) {
    const [workspace] = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.id, id))
        .limit(1);

    if (!workspace) return null;

    return await decryptWorkspaceTokens(workspace);
}

/**
 * Find workspace by Slack Team ID
 */
export async function findBySlackTeamId(slackTeamId: string) {
    const [workspace] = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.slackTeamId, slackTeamId))
        .limit(1);

    if (!workspace) return null;

    return await decryptWorkspaceTokens(workspace);
}

/**
 * Find workspace by GitHub Organization
 */
export async function findByGitHubOrg(githubOrg: string) {
    const [workspace] = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.githubOrg, githubOrg))
        .limit(1);

    if (!workspace) return null;

    return await decryptWorkspaceTokens(workspace);
}

/**
 * Find workspace by Jira Site
 */
export async function findByJiraSite(jiraSite: string) {
    const [workspace] = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.jiraSite, jiraSite))
        .limit(1);

    if (!workspace) return null;

    return await decryptWorkspaceTokens(workspace);
}

/**
 * Find workspace by any integration ID
 */
export async function findByIntegration(params: {
    slackTeamId?: string;
    githubOrg?: string;
    jiraSite?: string;
}) {
    const conditions = [];

    if (params.slackTeamId) {
        conditions.push(eq(schema.workspaces.slackTeamId, params.slackTeamId));
    }
    if (params.githubOrg) {
        conditions.push(eq(schema.workspaces.githubOrg, params.githubOrg));
    }
    if (params.jiraSite) {
        conditions.push(eq(schema.workspaces.jiraSite, params.jiraSite));
    }

    if (conditions.length === 0) return null;

    const [workspace] = await db
        .select()
        .from(schema.workspaces)
        .where(or(...conditions))
        .limit(1);

    if (!workspace) return null;

    return await decryptWorkspaceTokens(workspace);
}

/**
 * Create a new workspace
 */
export async function createWorkspace(input: CreateWorkspaceInput) {
    return await db.transaction(async (tx) => {
        const [workspace] = await tx
            .insert(schema.workspaces)
            .values({
                name: input.name,
                defaultPolicyTier: input.defaultPolicyTier || "standard",
            })
            .returning();

        if (!workspace) {
            throw new Error("Failed to create workspace");
        }

        await tx.insert(schema.workspaceMembers).values({
            workspaceId: workspace.id,
            userId: input.userId,
            role: "owner",
        });

        return workspace;
    });
}

/**
 * Update workspace
 * Encrypts any OAuth tokens before storage
 */
export async function updateWorkspace(id: string, input: UpdateWorkspaceInput) {
    // Encrypt tokens before writing to DB
    const encryptedInput = await encryptWorkspaceTokens(input);

    const [workspace] = await db
        .update(schema.workspaces)
        .set({
            ...encryptedInput,
            updatedAt: new Date(),
        })
        .where(eq(schema.workspaces.id, id))
        .returning();

    if (!workspace) return null;

    // Decrypt before returning
    return await decryptWorkspaceTokens(workspace);
}

/**
 * Get all workspaces for a specific user
 */
export async function getWorkspacesForUser(userId: string) {
    const result = await db
        .select({
            workspace: schema.workspaces,
        })
        .from(schema.workspaceMembers)
        .innerJoin(schema.workspaces, eq(schema.workspaces.id, schema.workspaceMembers.workspaceId))
        .where(eq(schema.workspaceMembers.userId, userId));

    return await Promise.all(result.map((row) => decryptWorkspaceTokens(row.workspace)));
}
