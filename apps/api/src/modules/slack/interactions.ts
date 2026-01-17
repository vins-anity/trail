/**
 * Slack Interactive Components Handler
 *
 * Handles button clicks from Slack messages (Reject/Veto).
 * Implements the interactive portion of Passive Handshake and Optimistic Closure.
 *
 * @see https://api.slack.com/interactivity/handling
 */

import crypto from "node:crypto";
import { Hono } from "hono";
import * as jobQueue from "../../lib/job-queue";
import * as eventsService from "../../services/events.service";

const app = new Hono();

/**
 * Verify Slack request signature
 * Prevents unauthorized requests from malicious actors
 */
function verifySlackSignature(body: string, timestamp: string, signature: string): boolean {
    const signingSecret = process.env.SLACK_SIGNING_SECRET;
    if (!signingSecret) {
        console.error("SLACK_SIGNING_SECRET not configured");
        return false;
    }

    // Reject requests older than 5 minutes (replay attack prevention)
    const requestTimestamp = Number.parseInt(timestamp);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - requestTimestamp) > 300) {
        return false;
    }

    // Compute expected signature
    const sigBasestring = `v0:${timestamp}:${body}`;
    const expectedSignature = `v0=${crypto
        .createHmac("sha256", signingSecret)
        .update(sigBasestring)
        .digest("hex")}`;

    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
}

/**
 * Parse Slack interaction payload
 * Slack sends form-urlencoded data with payload JSON
 */
interface SlackInteractionPayload {
    type: string;
    user: {
        id: string;
        username: string;
        name: string;
    };
    actions: Array<{
        action_id: string;
        value: string;
        type: string;
    }>;
    message: {
        ts: string;
    };
    channel: {
        id: string;
    };
}

/**
 * Handle handshake rejection
 */
async function handleHandshakeReject(
    eventId: string,
    userId: string,
    userName: string,
): Promise<{ blocks: unknown[] }> {
    console.log(`Processing handshake rejection for event ${eventId} by ${userName}`);

    // Update event as rejected
    await eventsService.rejectHandshake(eventId, userId);

    // Return updated message blocks
    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `❌ *Handshake Rejected by ${userName}*`,
                },
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `This task assignment was rejected on <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|${new Date().toISOString()}>`,
                    },
                ],
            },
        ],
    };
}

/**
 * Handle closure veto
 */
async function handleClosureVeto(
    closureJobId: string,
    userId: string,
    userName: string,
): Promise<{ blocks: unknown[] }> {
    console.log(`Processing closure veto for job ${closureJobId} by ${userName}`);

    // Cancel scheduled closure job
    await jobQueue.cancelClosureJob(closureJobId);

    // Mark closure as vetoed
    await eventsService.vetoOptimisticClosure(closureJobId, userId);

    // Return updated message blocks
    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `🛑 *Closure Vetoed by ${userName}*`,
                },
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `This task remains open for further work. Vetoed on <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|${new Date().toISOString()}>`,
                    },
                ],
            },
        ],
    };
}

/**
 * Main interactions endpoint
 * Slack POSTs here when users click buttons
 */
app.post("/", async (c) => {
    try {
        // Get raw body for signature verification
        const rawBody = await c.req.text();
        const timestamp = c.req.header("x-slack-request-timestamp") || "";
        const signature = c.req.header("x-slack-signature") || "";

        // Verify Slack signature
        if (!verifySlackSignature(rawBody, timestamp, signature)) {
            console.error("Invalid Slack signature");
            return c.json({ error: "Unauthorized" }, 401);
        }

        // Parse payload from form-urlencoded
        const params = new URLSearchParams(rawBody);
        const payloadStr = params.get("payload");
        if (!payloadStr) {
            return c.json({ error: "No payload" }, 400);
        }

        const payload: SlackInteractionPayload = JSON.parse(payloadStr);

        // Only handle block_actions
        if (payload.type !== "block_actions") {
            return c.json({ message: "Unsupported interaction type" });
        }

        const action = payload.actions[0];
        if (!action) {
            return c.json({ error: "No action" }, 400);
        }

        // Route to appropriate handler
        let response: { blocks: unknown[] };

        switch (action.action_id) {
            case "reject_handshake":
                response = await handleHandshakeReject(
                    action.value,
                    payload.user.id,
                    payload.user.name,
                );
                break;

            case "veto_closure":
                response = await handleClosureVeto(
                    action.value,
                    payload.user.id,
                    payload.user.name,
                );
                break;

            default:
                console.warn(`Unknown action_id: ${action.action_id}`);
                return c.json({ message: "Unknown action" });
        }

        // Return updated message (Slack will replace the original)
        return c.json(response);
    } catch (error) {
        console.error("Error handling Slack interaction:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

export default app;
