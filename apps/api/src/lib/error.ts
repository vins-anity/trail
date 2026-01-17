/**
 * Custom application errors for structured error handling.
 */

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

export class WebhookVerificationError extends AppError {
    constructor(provider: string) {
        super(`Webhook signature verification failed for ${provider}`, 401);
    }
}

// ============================================
// Utility Functions
// ============================================

/**
 * UUID v4 regex pattern
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID v4
 */
export function isValidUUID(str: string): boolean {
    return UUID_REGEX.test(str);
}

/**
 * Wraps a database operation to catch invalid UUID errors and return 404
 */
export async function withUUIDValidation<T>(
    id: string,
    _resourceName: string,
    operation: () => Promise<T | null>,
): Promise<T | null> {
    if (!isValidUUID(id)) {
        return null;
    }
    try {
        return await operation();
    } catch (error) {
        // Check for PostgreSQL invalid UUID error
        if (
            error instanceof Error &&
            error.message.includes("invalid input syntax for type uuid")
        ) {
            return null;
        }
        throw error;
    }
}
