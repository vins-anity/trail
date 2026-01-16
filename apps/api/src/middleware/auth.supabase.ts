/**
 * Authentication Middleware - Supabase
 *
 * This middleware verifies JWT tokens from Supabase Auth.
 * Add this to routes that require authentication.
 *
 * @example
 * // Protect a single route
 * app.get("/protected", authMiddleware, (c) => {
 *   const user = c.get("user");
 *   return c.json({ message: `Hello ${user.email}` });
 * });
 *
 * // Protect all routes under a path
 * app.use("/api/*", authMiddleware);
 */

import { createClient } from "@supabase/supabase-js";
import type { Context, Next } from "hono";

// ============================================
// Supabase Client Setup
// ============================================

/**
 * Initialize Supabase client with environment variables.
 * These should be set in your .env file:
 *   SUPABASE_URL=your-project-url.supabase.co
 *   SUPABASE_ANON_KEY=your-anon-key
 */
const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "");

// ============================================
// Types
// ============================================

/**
 * User object stored in context after authentication.
 * Access via: c.get("user")
 */
export interface AuthUser {
    id: string;
    email: string;
    role?: string;
}

// ============================================
// Middleware
// ============================================

/**
 * Supabase Auth Middleware
 *
 * Extracts and verifies the JWT token from the Authorization header.
 * If valid, attaches the user object to the context.
 * If invalid or missing, returns 401 Unauthorized.
 *
 * Token format: "Bearer <jwt_token>"
 */
export async function authMiddleware(c: Context, next: Next) {
    // Extract token from Authorization header
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json(
            {
                error: "Unauthorized",
                message: "Missing or invalid Authorization header",
            },
            401,
        );
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        // Verify token with Supabase
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return c.json(
                {
                    error: "Unauthorized",
                    message: "Invalid or expired token",
                },
                401,
            );
        }

        // Attach user to context for use in route handlers
        c.set("user", {
            id: user.id,
            email: user.email,
            role: user.role,
        } as AuthUser);

        // Continue to next middleware/handler
        await next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return c.json(
            {
                error: "Unauthorized",
                message: "Authentication failed",
            },
            401,
        );
    }
}

/**
 * Optional Auth Middleware
 *
 * Like authMiddleware, but doesn't block unauthenticated requests.
 * Useful for routes that have different behavior for logged-in users.
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser(token);

            if (user) {
                c.set("user", {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                } as AuthUser);
            }
        } catch {
            // Silently ignore auth errors for optional auth
        }
    }

    await next();
}
