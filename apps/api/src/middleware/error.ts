import type { Context, Next } from "hono";

/**
 * Global Error Handler Middleware
 *
 * Catches unhandled errors and returns consistent error responses.
 * In production, you might want to log to a service like Sentry.
 */
export async function errorHandler(c: Context, next: Next) {
    try {
        await next();
    } catch (error) {
        console.error("Unhandled error:", error);

        // Check if it's a known error type
        if (error instanceof Error) {
            // Validation errors from Valibot
            if (error.name === "ValiError") {
                return c.json(
                    {
                        error: "Validation failed",
                        details: error.message,
                    },
                    400,
                );
            }

            // Database connection errors
            if (error.message.includes("ECONNREFUSED")) {
                return c.json(
                    {
                        error: "Database connection failed",
                        message: "Please check your database configuration",
                    },
                    503,
                );
            }
        }

        // Generic server error
        return c.json(
            {
                error: "Internal server error",
                message:
                    process.env.NODE_ENV === "development"
                        ? String(error)
                        : "An unexpected error occurred",
            },
            500,
        );
    }
}

/**
 * Request Logger Middleware
 *
 * Logs request details for debugging.
 * Uses Hono's built-in logger for basic logging.
 */
export async function requestLogger(c: Context, next: Next) {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    console.log(`${c.req.method} ${c.req.path} - ${c.res.status} (${duration}ms)`);
}

/**
 * CORS Headers Middleware
 *
 * Adds CORS headers for development.
 * In production, configure this more restrictively.
 */
export async function corsHeaders(c: Context, next: Next) {
    await next();

    c.res.headers.set("Access-Control-Allow-Origin", "*");
    c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    c.res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
