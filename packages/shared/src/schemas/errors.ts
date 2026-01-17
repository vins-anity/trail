/**
 * Trail AI Error Schemas
 *
 * Standardized error response schemas for API.
 * Used across all route modules for consistent error handling.
 */

import * as v from "valibot";

// ============================================
// Error Response Schema
// ============================================

export const ErrorResponseSchema = v.object({
    error: v.string(),
    code: v.optional(v.string()),
    details: v.optional(v.unknown()),
});

export const ValidationErrorSchema = v.object({
    error: v.string(),
    code: v.literal("VALIDATION_ERROR"),
    details: v.object({
        field: v.string(),
        message: v.string(),
    }),
});

// ============================================
// Types
// ============================================

export type ErrorResponse = v.InferOutput<typeof ErrorResponseSchema>;
export type ValidationError = v.InferOutput<typeof ValidationErrorSchema>;
