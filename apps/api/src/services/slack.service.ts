/**
 * Slack Notification Service
 *
 * Implements notification flows from Trail AI thesis:
 * - PHASE 1: Passive Handshake notification to developer
 * - PHASE 3: Optimistic Closure proposal to team lead
 *
 * @see docs/trail.md Section 5.3 "End-to-End Event Flow"
 */

import * as slackClient from "../lib/slack-client";

/**
 * PHASE 1: Send Passive Handshake notification to developer
 *
 * Thesis requirement:
 * "Slack DM to Dev: 'Tracking started for [Task Name]. Click [Reject] if this is an error.'"
 *
 * @param workspaceId - Workspace ID
 * @param taskId - Jira task ID (e.g., TRAIL-123)
 * @param taskTitle - Human-readable task title
 * @param developerEmail - Developer's email address (from Jira assignee)
 */
export async function sendHandshakeNotification(
    workspaceId: string,
    taskId: string,
    taskTitle: string,
    developerEmail: string,
): Promise<void> {
    try {
        const client = await slackClient.createSlackClient(workspaceId);

        // Find developer's Slack user ID by email
        const userId = await slackClient.findUserByEmail(client, developerEmail);

        if (!userId) {
            console.warn(`Slack user not found for email: ${developerEmail}`);
            return;
        }

        // Build interactive message with Reject button (Block Kit format)
        const blocks = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Tracking started for ${taskId}*\n${taskTitle}\n\nClick *Reject* if this assignment is an error.`,
                },
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Reject",
                            emoji: true,
                        },
                        style: "danger",
                        value: taskId,
                        action_id: "reject_handshake",
                    },
                ],
            },
        ];

        await slackClient.sendDirectMessage(
            client,
            userId,
            blocks,
            `Tracking started for ${taskId}: ${taskTitle}`,
        );

        console.log(`✅ Handshake notification sent to ${developerEmail} for ${taskId}`);
    } catch (error) {
        console.error(`Failed to send handshake notification for ${taskId}:`, error);
        // Don't throw - notifications are non-critical
    }
}

/**
 * PHASE 3: Send Optimistic Closure proposal to team lead
 *
 * Thesis requirement:
 * "Slack message to Lead: 'Task Complete. Auto-closing in 24h. Click [Veto] to stop.'"
 *
 * @param workspaceId - Workspace ID
 * @param taskId - Jira task ID
 * @param taskTitle - Human-readable task title
 * @param leadEmail - Team lead/manager email (from Jira reporter)
 * @param autoCloseAt - Scheduled auto-close timestamp
 */
export async function sendClosureProposal(
    workspaceId: string,
    taskId: string,
    taskTitle: string,
    leadEmail: string,
    autoCloseAt: Date,
): Promise<void> {
    try {
        const client = await slackClient.createSlackClient(workspaceId);

        // Find lead's Slack user ID by email
        const userId = await slackClient.findUserByEmail(client, leadEmail);

        if (!userId) {
            console.warn(`Slack user not found for email: ${leadEmail}`);
            return;
        }

        // Calculate time until auto-close
        const hoursUntilClose = Math.round((autoCloseAt.getTime() - Date.now()) / (1000 * 60 * 60));

        // Build interactive message with Veto button
        const blocks = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Task Complete: ${taskId}*\n${taskTitle}\n\n✅ PR merged, approvals met, CI passed.\n⏰ Auto-closing in *${hoursUntilClose}h*.\n\nClick *Veto* to prevent auto-close.`,
                },
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Veto",
                            emoji: true,
                        },
                        style: "danger",
                        value: taskId,
                        action_id: "veto_closure",
                    },
                ],
            },
        ];

        await slackClient.sendDirectMessage(
            client,
            userId,
            blocks,
            `Task ${taskId} complete. Auto-closing in ${hoursUntilClose}h.`,
        );

        console.log(`✅ Closure proposal sent to ${leadEmail} for ${taskId}`);
    } catch (error) {
        console.error(`Failed to send closure proposal for ${taskId}:`, error);
        // Don't throw - notifications are non-critical
    }
}
