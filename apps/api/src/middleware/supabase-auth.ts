/**
 * Supabase Auth Middleware
 *
 * Verifies Supabase JWT tokens for user authentication.
 * Attaches authenticated user to context.
 */

import type { Context, Next } from "hono";
import { verifySupabaseToken } from "../services/auth.service";

/**
 * Middleware to verify Supabase Auth token
 * Adds `user` to context if authenticated
 */
export async function supabaseAuth(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const user = await verifySupabaseToken(token);
        c.set("user", user);
        c.set("userId", user.id);
        await next();
    } catch (_error) {
        return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }
}

/**
 * Optional authentication - doesn't fail if no token
 * Use for public endpoints that change behavior when authenticated
 */
export async function optionalAuth(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        try {
            const user = await verifySupabaseToken(token);
            c.set("user", user);
            c.set("userId", user.id);
        } catch {
            // Silently ignore invalid tokens for optional auth
        }
    }

    await next();
}
