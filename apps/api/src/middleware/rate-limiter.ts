/**
 * Rate Limiter Middleware
 *
 * Simple in-memory rate limiter for webhook endpoints.
 * Uses token bucket algorithm with automatic cleanup.
 */

import type { Context, Next } from "hono";

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface BucketEntry {
    count: number;
    resetAt: number;
}

const buckets = new Map<string, BucketEntry>();

/**
 * Cleanup expired buckets every 5 minutes
 */
setInterval(
    () => {
        const now = Date.now();
        for (const [key, bucket] of buckets.entries()) {
            if (bucket.resetAt < now) {
                buckets.delete(key);
            }
        }
    },
    5 * 60 * 1000,
);

/**
 * Create rate limiter middleware
 *
 * @param config - Rate limit configuration
 * @returns Hono middleware function
 */
export function rateLimiter(config: RateLimitConfig) {
    const { maxRequests, windowMs } = config;

    return async (c: Context, next: Next) => {
        // Get client identifier (IP address)
        const clientIp = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";

        const key = `${c.req.path}:${clientIp}`;
        const now = Date.now();

        let bucket = buckets.get(key);

        // Create or reset bucket
        if (!bucket || bucket.resetAt < now) {
            bucket = {
                count: 0,
                resetAt: now + windowMs,
            };
            buckets.set(key, bucket);
        }

        // Check limit
        if (bucket.count >= maxRequests) {
            const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);

            return c.json(
                {
                    error: "Too many requests",
                    retryAfter,
                },
                429,
                {
                    "Retry-After": retryAfter.toString(),
                    "X-RateLimit-Limit": maxRequests.toString(),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": bucket.resetAt.toString(),
                },
            );
        }

        // Increment counter
        bucket.count++;

        // Add rate limit headers
        c.header("X-RateLimit-Limit", maxRequests.toString());
        c.header("X-RateLimit-Remaining", (maxRequests - bucket.count).toString());
        c.header("X-RateLimit-Reset", bucket.resetAt.toString());

        await next();
    };
}

/**
 * Preset configurations
 */
export const RateLimits = {
    /**
     * For webhook endpoints (100 req/min)
     */
    webhooks: {
        maxRequests: 100,
        windowMs: 60 * 1000, // 1 minute
    },

    /**
     * For API endpoints (1000 req/min)
     */
    api: {
        maxRequests: 1000,
        windowMs: 60 * 1000,
    },

    /**
     * Strict limit for auth endpoints (10 req/min)
     */
    auth: {
        maxRequests: 10,
        windowMs: 60 * 1000,
    },
};
