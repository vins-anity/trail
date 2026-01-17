/**
 * Trail AI Shared Package
 *
 * Centralized schemas and types for the Trail AI platform.
 * Used by both API and frontend for type safety.
 */

import * as v from "valibot";

// ============================================
// Trail AI Schemas
// ============================================

// Events - Hash-chained audit log
export * from "./schemas/events";

// Proofs - Shareable delivery receipts
export * from "./schemas/proofs";

// Policies - Closure rules
export * from "./schemas/policies";

// Workspaces - Multi-tenant support
export * from "./schemas/workspaces";

// Webhooks - External integrations
export * from "./schemas/webhooks";

// Errors - Standardized error responses
export * from "./schemas/errors";

// ============================================
// Common Schemas
// ============================================

export const PaginationSchema = v.object({
    page: v.optional(v.pipe(v.string(), v.transform(Number)), "1"),
    pageSize: v.optional(v.pipe(v.string(), v.transform(Number)), "20"),
});

export const IdParamSchema = v.object({
    id: v.string(),
});

export const SuccessResponseSchema = v.object({
    success: v.boolean(),
    message: v.optional(v.string()),
});

export const ErrorResponseSchema = v.object({
    error: v.string(),
    code: v.optional(v.string()),
    details: v.optional(v.record(v.string(), v.unknown())),
});

export type Pagination = v.InferOutput<typeof PaginationSchema>;
export type IdParam = v.InferOutput<typeof IdParamSchema>;
export type SuccessResponse = v.InferOutput<typeof SuccessResponseSchema>;
export type ErrorResponse = v.InferOutput<typeof ErrorResponseSchema>;
