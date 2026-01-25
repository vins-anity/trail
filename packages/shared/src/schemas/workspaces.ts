/**
 * ShipDocket Workspace Schemas
 *
 * Shared schemas for multi-tenant workspaces.
 */

import * as v from "valibot";
import { PolicyTierSchema } from "./policies";

// ============================================
// Schemas
// ============================================

export const WorkspaceSchema = v.object({
    id: v.string(),
    name: v.string(),
    slackTeamId: v.optional(v.nullable(v.string())),
    githubOrg: v.optional(v.nullable(v.string())),
    jiraSite: v.optional(v.nullable(v.string())),
    defaultPolicyTier: v.optional(PolicyTierSchema),
    createdAt: v.string(),
    updatedAt: v.string(),
});

export const CreateWorkspaceSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, "Name is required")),
    defaultPolicyTier: v.optional(PolicyTierSchema),
});

export const UpdateWorkspaceSchema = v.object({
    name: v.optional(v.pipe(v.string(), v.minLength(1))),
    defaultPolicyTier: v.optional(PolicyTierSchema),
});

export const ConnectSlackSchema = v.object({
    code: v.string(), // OAuth code
    redirectUri: v.string(),
});

export const ConnectGitHubSchema = v.object({
    installationId: v.string(),
    setupAction: v.optional(v.picklist(["install", "update"])),
});

export const ConnectJiraSchema = v.object({
    code: v.string(), // OAuth code
    redirectUri: v.string(),
});

export const WorkspaceListSchema = v.object({
    workspaces: v.array(WorkspaceSchema),
});

// ============================================
// Types
// ============================================

export type Workspace = v.InferOutput<typeof WorkspaceSchema>;
export type CreateWorkspace = v.InferOutput<typeof CreateWorkspaceSchema>;
export type UpdateWorkspace = v.InferOutput<typeof UpdateWorkspaceSchema>;
export type WorkspaceList = v.InferOutput<typeof WorkspaceListSchema>;
