/**
 * Workspaces Service
 *
 * Database operations for multi-tenant workspace management.
 * Provides lookup by integration IDs (Slack, GitHub, Jira).
 */

import { eq, or } from "drizzle-orm";
import type { PolicyTier } from "shared";
import { db, schema } from "../db";

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

    return workspace || null;
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

    return workspace || null;
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

    return workspace || null;
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

    return workspace || null;
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

    return workspace || null;
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
 */
export async function updateWorkspace(id: string, input: UpdateWorkspaceInput) {
    const [workspace] = await db
        .update(schema.workspaces)
        .set({
            ...input,
            updatedAt: new Date(),
        })
        .where(eq(schema.workspaces.id, id))
        .returning();

    return workspace || null;
}

/**
 * List all workspaces
 */
export async function listWorkspaces() {
    return db.select().from(schema.workspaces);
}
