/**
 * Token Encryption Utilities
 *
 * Uses Bun's Web Crypto API for AES-256-GCM encryption of OAuth tokens.
 * Tokens are encrypted at rest in the database for security.
 *
 * @see https://bun.com/docs/runtime/web-crypto
 */

import { env } from "../env";

// Web Crypto API is available globally in Bun
const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;

/**
 * Get or generate encryption key from environment
 */
async function getEncryptionKey(): Promise<CryptoKey> {
    const keyString = env.ENCRYPTION_KEY;

    // Convert hex string to ArrayBuffer
    const keyData = new Uint8Array(
        (keyString || "").match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [],
    );

    return await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ["encrypt", "decrypt"],
    );
}

/**
 * Encrypt an OAuth token for storage
 * @param token - Plaintext OAuth token
 * @returns Encrypted token as hex string (iv + encrypted data)
 */
export async function encryptToken(token: string): Promise<string> {
    const key = await getEncryptionKey();

    // Generate random IV (12 bytes for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encode token as UTF-8
    const encodedToken = new TextEncoder().encode(token);

    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encodedToken);

    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to hex string for storage
    return Array.from(combined)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * Decrypt an OAuth token from storage
 * @param encryptedHex - Encrypted token as hex string
 * @returns Decrypted plaintext token
 */
export async function decryptToken(encryptedHex: string): Promise<string> {
    const key = await getEncryptionKey();

    // Convert hex string to Uint8Array
    const combined = new Uint8Array(
        encryptedHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [],
    );

    // Extract IV (first 12 bytes) and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        key,
        encryptedData,
    );

    // Decode UTF-8
    return new TextDecoder().decode(decryptedBuffer);
}

/**
 * Generate a new 256-bit encryption key
 * Use this once to generate ENCRYPTION_KEY for .env
 * @returns 32-byte key as hex string
 */
export function generateEncryptionKey(): string {
    const key = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(key)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * Validate that decryption works (for testing)
 */
export async function validateEncryption(): Promise<boolean> {
    const testToken = "test-oauth-token-12345";
    const encrypted = await encryptToken(testToken);
    const decrypted = await decryptToken(encrypted);
    return testToken === decrypted;
}
