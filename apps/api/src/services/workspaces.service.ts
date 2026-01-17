/**
 * Workspaces Service
 *
 * Database operations for multi-tenant workspace management.
 * Provides lookup by integration IDs (Slack, GitHub, Jira).
 *
 * Security: OAuth tokens are encrypted at rest using AES-256-GCM.
 */

import { eq, or } from "drizzle-orm";
import type { PolicyTier } from "shared";
import { db, schema } from "../db";
import { decryptToken, encryptToken } from "../lib/token-encryption";

// ============================================
// Types
// ============================================

export interface CreateWorkspaceInput {
    name: string;
    defaultPolicyTier?: PolicyTier;
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
}

// ============================================
// Helper Functions
// ============================================

/**
 * Decrypt workspace tokens after DB read
 */
async function decryptWorkspaceTokens(workspace: any) {
    if (workspace.slackAccessToken) {
        workspace.slackAccessToken = await decryptToken(workspace.slackAccessToken);
    }
    if (workspace.githubInstallationId) {
        workspace.githubInstallationId = await decryptToken(workspace.githubInstallationId);
    }
    if (workspace.jiraAccessToken) {
        workspace.jiraAccessToken = await decryptToken(workspace.jiraAccessToken);
    }
    return workspace;
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
    const [workspace] = await db
        .insert(schema.workspaces)
        .values({
            name: input.name,
            defaultPolicyTier: input.defaultPolicyTier || "standard",
        })
        .returning();

    return workspace;
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
 * List all workspaces
 * Note: Tokens are NOT decrypted in list view for performance
 */
export async function listWorkspaces() {
    return db.select().from(schema.workspaces);
}
