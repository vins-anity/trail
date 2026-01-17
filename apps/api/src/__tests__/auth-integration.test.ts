/**
 * Integration Test: End-to-End Auth Flow
 *
 * Tests the complete flow from encryption to OAuth to storage
 */

import { beforeAll, describe, expect, test } from "bun:test";
import { decryptToken, encryptToken, generateEncryptionKey } from "../lib/token-encryption";
import * as authService from "../services/auth.service";

describe("Integration: Auth & Encryption Flow", () => {
    beforeAll(() => {
        process.env.ENCRYPTION_KEY = generateEncryptionKey();
        process.env.SLACK_CLIENT_ID = "test-client-id";
        process.env.SLACK_CLIENT_SECRET = "test-secret";
    });

    test("end-to-end: Generate OAuth URL → Exchange Code → Encrypt Token", async () => {
        // Step 1: Generate OAuth URL
        const workspaceId = "test-workspace-123";
        const state = JSON.stringify({ workspaceId });
        const redirectUri = "http://localhost:3000/auth/slack/callback";

        const authUrl = authService.getAuthorizationUrl("slack", state, redirectUri);

        expect(authUrl).toContain("slack.com");
        expect(authUrl).toContain(encodeURIComponent(state)); // URL encoded

        // Step 2: Simulate token encryption (what would happen after OAuth callback)
        const mockAccessToken = "xoxb-mock-slack-access-token-abc123";
        const mockRefreshToken = "xoxr-mock-refresh-token-xyz789";

        const encryptedAccess = await encryptToken(mockAccessToken);
        const encryptedRefresh = await encryptToken(mockRefreshToken);

        // Verify encrypted tokens are different
        expect(encryptedAccess).not.toBe(encryptedRefresh);

        // Step 3: Simulate storage and retrieval
        // (In real scenario, these would be stored in DB)
        const storedTokens = {
            access: encryptedAccess,
            refresh: encryptedRefresh,
        };

        // Step 4: Retrieve and decrypt
        const decryptedAccess = await decryptToken(storedTokens.access);
        const decryptedRefresh = await decryptToken(storedTokens.refresh);

        expect(decryptedAccess).toBe(mockAccessToken);
        expect(decryptedRefresh).toBe(mockRefreshToken);
    });

    test("security: Encrypted tokens should not leak original value", async () => {
        const secretToken = "xoxb-super-secret-token";
        const encrypted = await encryptToken(secretToken);

        // Encrypted value should not contain original token
        expect(encrypted).not.toContain(secretToken);

        // Should not contain 'xoxb'
        expect(encrypted).not.toContain("xoxb");
    });

    test("all OAuth providers should follow same flow", async () => {
        const providers: authService.OAuthProvider[] = ["slack", "github", "jira"];
        const testToken = "test-oauth-token";

        for (const provider of providers) {
            // Set client ID for provider
            process.env[`${provider.toUpperCase()}_CLIENT_ID`] = "test-id";

            // Generate URL
            const url = authService.getAuthorizationUrl(provider, "state", "redirect");
            expect(url).toBeTruthy();

            // Encrypt token
            const encrypted = await encryptToken(testToken);
            const decrypted = await decryptToken(encrypted);

            expect(decrypted).toBe(testToken);
        }
    });

    test("performance: encryption should be fast", async () => {
        const token = "test-token-for-performance";
        const iterations = 100;

        const start = Date.now();

        for (let i = 0; i < iterations; i++) {
            const encrypted = await encryptToken(token);
            await decryptToken(encrypted);
        }

        const duration = Date.now() - start;
        const avgTime = duration / iterations;

        // Should take less than 10ms per encrypt+decrypt cycle on average
        expect(avgTime).toBeLessThan(10);
    });
});
