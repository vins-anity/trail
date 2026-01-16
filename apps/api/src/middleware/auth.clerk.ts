/**
 * Authentication Middleware - Clerk
 *
 * This middleware verifies JWTs from Clerk authentication.
 * Clerk is a modern auth platform with great DX.
 *
 * Setup:
 * 1. Create a Clerk application at https://clerk.com
 * 2. Add CLERK_SECRET_KEY to your .env file
 * 3. Apply this middleware to protected routes
 *
 * @example
 * // Protect a route
 * app.get("/dashboard", clerkAuthMiddleware, (c) => {
 *   const user = c.get("user");
 *   return c.json({ userId: user.id });
 * });
 */

import { createClerkClient } from "@clerk/backend";
import type { Context, Next } from "hono";

// ============================================
// Clerk Client Setup
// ============================================

/**
 * Initialize Clerk client with your secret key.
 * Get this from: Clerk Dashboard -> API Keys
 */
const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

// ============================================
// Types
// ============================================

/**
 * User object stored in context after authentication.
 */
export interface ClerkUser {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
}

// ============================================
// Middleware
// ============================================

/**
 * Clerk Auth Middleware
 *
 * Verifies the session token from the Authorization header.
 * The token is typically passed as: "Bearer <session_token>"
 *
 * For frontend integration, use Clerk's React SDK which
 * automatically handles token management.
 */
export async function clerkAuthMiddleware(c: Context, next: Next) {
    // Extract token from header
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json(
            {
                error: "Unauthorized",
                message: "Missing Authorization header",
            },
            401,
        );
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        // Verify the session token with Clerk
        const session = await clerk.sessions.verifySession(token, token);

        // Get user details
        const user = await clerk.users.getUser(session.userId);

        // Attach user to context
        c.set("user", {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || null,
            firstName: user.firstName,
            lastName: user.lastName,
        } as ClerkUser);

        await next();
    } catch (error) {
        console.error("Clerk auth error:", error);
        return c.json(
            {
                error: "Unauthorized",
                message: "Invalid session",
            },
            401,
        );
    }
}

/**
 * Require Specific Role Middleware
 *
 * Use after clerkAuthMiddleware to check for specific roles.
 *
 * @example
 * app.get("/admin", clerkAuthMiddleware, requireRole("admin"), handler);
 */
export function requireRole(role: string) {
    return async (c: Context, next: Next) => {
        const user = c.get("user") as ClerkUser | undefined;

        if (!user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        // Check user's public metadata for role
        // You would set this in Clerk Dashboard or via API
        // This is a simplified example - customize based on your role system
        const userRole = (c.get("userRole") as string) || "user";

        if (userRole !== role) {
            return c.json(
                {
                    error: "Forbidden",
                    message: `This action requires the '${role}' role`,
                },
                403,
            );
        }

        await next();
    };
}
