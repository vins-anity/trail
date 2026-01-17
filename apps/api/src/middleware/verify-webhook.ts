/**
 * Webhook Signature Verification Middleware
 *
 * Implements HMAC-SHA256 signature validation for:
 * - Slack Events API
 * - GitHub Webhooks
 * - Jira Webhooks
 *
 * Each provider has a different signing mechanism, so we provide
 * separate middleware functions for each.
 *
 * @see Section 5.4.1 in thesis: "Webhook Router"
 */

import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { env } from "../config/env";

// ============================================
// Slack Signature Verification
// ============================================

/**
 * Verifies Slack request signatures using HMAC-SHA256.
 *
 * Slack signs requests with:
 * - X-Slack-Signature: v0=<signature>
 * - X-Slack-Request-Timestamp: <timestamp>
 *
 * The signature is computed as:
 * HMAC-SHA256(signing_secret, "v0:<timestamp>:<body>")
 *
 * @see https://api.slack.com/authentication/verifying-requests-from-slack
 */
export const verifySlackSignature: MiddlewareHandler = async (c, next) => {
    const signingSecret = env.SLACK_SIGNING_SECRET;

    if (!signingSecret) {
        console.warn("[Webhook] SLACK_SIGNING_SECRET not configured, skipping verification");
        return next();
    }

    const signature = c.req.header("X-Slack-Signature");
    const timestamp = c.req.header("X-Slack-Request-Timestamp");

    if (!signature || !timestamp) {
        throw new HTTPException(401, { message: "Missing Slack signature headers" });
    }

    // Prevent replay attacks (reject if older than 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - Number.parseInt(timestamp, 10)) > 300) {
        throw new HTTPException(401, { message: "Request timestamp too old" });
    }

    const body = await c.req.text();
    const sigBase = `v0:${timestamp}:${body}`;

    const expectedSignature = await computeHmacSha256(signingSecret, sigBase);
    const expectedSig = `v0=${expectedSignature}`;

    if (!timingSafeEqual(signature, expectedSig)) {
        throw new HTTPException(401, { message: "Invalid Slack signature" });
    }

    // Store raw body for later use (since we consumed it)
    c.set("rawBody", body);

    return next();
};

// ============================================
// GitHub Signature Verification
// ============================================

/**
 * Verifies GitHub webhook signatures using HMAC-SHA256.
 *
 * GitHub signs requests with:
 * - X-Hub-Signature-256: sha256=<signature>
 *
 * The signature is computed as:
 * HMAC-SHA256(secret, body)
 *
 * @see https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
 */
export const verifyGitHubSignature: MiddlewareHandler = async (c, next) => {
    const secret = env.GITHUB_WEBHOOK_SECRET;

    if (!secret) {
        console.warn("[Webhook] GITHUB_WEBHOOK_SECRET not configured, skipping verification");
        return next();
    }

    const signature = c.req.header("X-Hub-Signature-256");

    if (!signature) {
        throw new HTTPException(401, { message: "Missing GitHub signature header" });
    }

    const body = await c.req.text();
    const expectedSignature = await computeHmacSha256(secret, body);
    const expectedSig = `sha256=${expectedSignature}`;

    if (!timingSafeEqual(signature, expectedSig)) {
        throw new HTTPException(401, { message: "Invalid GitHub signature" });
    }

    // Store raw body for later use
    c.set("rawBody", body);

    return next();
};

// ============================================
// Jira Signature Verification
// ============================================

/**
 * Verifies Jira webhook signatures.
 *
 * Jira Cloud webhooks can be configured with a secret that's
 * sent as a query parameter or header. We support both approaches.
 *
 * For Jira Server/Data Center, we use HMAC signature verification
 * similar to GitHub.
 *
 * @see https://developer.atlassian.com/cloud/jira/platform/webhooks/
 */
export const verifyJiraSignature: MiddlewareHandler = async (c, next) => {
    const secret = env.JIRA_WEBHOOK_SECRET;

    if (!secret) {
        console.warn("[Webhook] JIRA_WEBHOOK_SECRET not configured, skipping verification");
        return next();
    }

    // Check for secret in query parameter (Jira Cloud approach)
    const querySecret = c.req.query("secret");
    if (querySecret) {
        if (!timingSafeEqual(querySecret, secret)) {
            throw new HTTPException(401, { message: "Invalid Jira webhook secret" });
        }
        return next();
    }

    // Check for HMAC signature in header (Jira Server approach)
    const signature = c.req.header("X-Atlassian-Webhook-Signature");
    if (signature) {
        const body = await c.req.text();
        const expectedSignature = await computeHmacSha256(secret, body);

        if (!timingSafeEqual(signature, expectedSignature)) {
            throw new HTTPException(401, { message: "Invalid Jira signature" });
        }

        c.set("rawBody", body);
        return next();
    }

    // No verification mechanism found
    throw new HTTPException(401, { message: "Missing Jira authentication" });
};

// ============================================
// Utility Functions
// ============================================

/**
 * Computes HMAC-SHA256 signature using Web Crypto API.
 */
async function computeHmacSha256(secret: string, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const message = encoder.encode(data);

    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );

    const signature = await crypto.subtle.sign("HMAC", key, message);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Timing-safe string comparison to prevent timing attacks.
 *
 * Uses constant-time comparison to avoid leaking information
 * about the expected value through timing differences.
 */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
        // Compare against itself to maintain constant time
        // even when lengths differ
        b = a;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0 && a.length === b.length;
}

// ============================================
// Type Augmentation
// ============================================

declare module "hono" {
    interface ContextVariableMap {
        rawBody: string;
    }
}
