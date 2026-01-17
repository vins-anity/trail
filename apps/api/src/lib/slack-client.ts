/**
 * Slack API Client
 *
 * Wrapper around @slack/web-api for Trail AI.
 * Handles authentication and common operations.
 */

import { WebClient } from "@slack/web-api";
import * as authService from "../services/auth.service";

/**
 * Create authenticated Slack client for workspace
 */
export async function createSlackClient(workspaceId: string): Promise<WebClient> {
    const token = await authService.getOAuthToken(workspaceId, "slack");

    if (!token) {
        throw new Error(`Slack not connected for workspace ${workspaceId}`);
    }

    return new WebClient(token);
}

/**
 * Find Slack user ID by email
 * Uses users.lookupByEmail API
 */
export async function findUserByEmail(client: WebClient, email: string): Promise<string | null> {
    try {
        const result = await client.users.lookupByEmail({ email });

        if (result.ok && result.user) {
            return result.user.id as string;
        }

        return null;
    } catch (error) {
        console.error(`Failed to lookup Slack user by email ${email}:`, error);
        return null;
    }
}

/**
 * Send DM to user
 * Opens a conversation and posts a message
 */
export async function sendDirectMessage(
    client: WebClient,
    userId: string,
    blocks: any[],
    text: string,
): Promise<void> {
    try {
        // Open DM channel
        const conversation = await client.conversations.open({
            users: userId,
        });

        if (!conversation.ok || !conversation.channel) {
            throw new Error("Failed to open DM channel");
        }

        // Send message
        await client.chat.postMessage({
            channel: conversation.channel.id as string,
            blocks,
            text, // Fallback text for notifications
        });
    } catch (error) {
        console.error(`Failed to send Slack DM to ${userId}:`, error);
        throw error;
    }
}
