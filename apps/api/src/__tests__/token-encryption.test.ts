/**
 * Token Encryption Tests
 *
 * Tests for Bun Web Crypto API encryption/decryption
 */

import { beforeAll, describe, expect, test } from "bun:test";
import {
    decryptToken,
    encryptToken,
    generateEncryptionKey,
    validateEncryption,
} from "../lib/token-encryption";

describe("Token Encryption", () => {
    beforeAll(() => {
        // Set test encryption key
        if (!process.env.ENCRYPTION_KEY) {
            process.env.ENCRYPTION_KEY = generateEncryptionKey();
        }
    });

    test("should encrypt and decrypt a simple token", async () => {
        const originalToken = "xoxb-test-slack-token-12345";

        const encrypted = await encryptToken(originalToken);
        const decrypted = await decryptToken(encrypted);

        expect(decrypted).toBe(originalToken);
    });

    test("should produce different ciphertext for same token (random IV)", async () => {
        const token = "test-token";

        const encrypted1 = await encryptToken(token);
        const encrypted2 = await encryptToken(token);

        // Different IVs should produce different ciphertexts
        expect(encrypted1).not.toBe(encrypted2);

        // But both should decrypt to same value
        expect(await decryptToken(encrypted1)).toBe(token);
        expect(await decryptToken(encrypted2)).toBe(token);
    });

    test("should handle long tokens (OAuth access tokens)", async () => {
        // Simulate 256-character OAuth token
        const longToken = "a".repeat(256);

        const encrypted = await encryptToken(longToken);
        const decrypted = await decryptToken(encrypted);

        expect(decrypted).toBe(longToken);
    });

    test("should handle tokens with special characters", async () => {
        const specialToken = "xoxb-123-test_token.with-special/chars+equals=";

        const encrypted = await encryptToken(specialToken);
        const decrypted = await decryptToken(encrypted);

        expect(decrypted).toBe(specialToken);
    });

    test("should handle empty string", async () => {
        const emptyToken = "";

        const encrypted = await encryptToken(emptyToken);
        const decrypted = await decryptToken(encrypted);

        expect(decrypted).toBe(emptyToken);
    });

    test("should fail to decrypt with wrong key", async () => {
        const token = "test-token";
        const encrypted = await encryptToken(token);

        // Change encryption key
        const originalKey = process.env.ENCRYPTION_KEY;
        process.env.ENCRYPTION_KEY = generateEncryptionKey();

        // Should throw error with wrong key
        expect(async () => {
            await decryptToken(encrypted);
        }).toThrow();

        // Restore original key
        process.env.ENCRYPTION_KEY = originalKey;
    });

    test("should fail to decrypt corrupted ciphertext", async () => {
        const token = "test-token";
        const encrypted = await encryptToken(token);

        // Corrupt the ciphertext by changing a character
        const corrupted = `${encrypted.slice(0, -2)}ff`;

        expect(async () => {
            await decryptToken(corrupted);
        }).toThrow();
    });

    test("validateEncryption should return true", async () => {
        const isValid = await validateEncryption();
        expect(isValid).toBe(true);
    });

    test("should handle Unicode characters", async () => {
        const unicodeToken = "token-with-emoji-🔐-and-中文";

        const encrypted = await encryptToken(unicodeToken);
        const decrypted = await decryptToken(encrypted);

        expect(decrypted).toBe(unicodeToken);
    });

    test("encrypted output should be hex string", async () => {
        const token = "test-token";
        const encrypted = await encryptToken(token);

        // Should only contain hex characters (0-9, a-f)
        expect(/^[0-9a-f]+$/.test(encrypted)).toBe(true);
    });

    test("generateEncryptionKey should create 64-char hex string", () => {
        const key = generateEncryptionKey();

        expect(key.length).toBe(64); // 32 bytes = 64 hex chars
        expect(/^[0-9a-f]+$/.test(key)).toBe(true);
    });
});
