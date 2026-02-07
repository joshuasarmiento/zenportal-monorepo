import { createHash, randomBytes } from 'node:crypto';

/**
 * Hashes an API key using SHA-256.
 * We use a fast hash because these are high-entropy random keys (UUIDs),
 * so authorized speed is prioritized over slow hashing (like bcrypt) 
 * which is needed for low-entropy passwords.
 */
export const hashApiKey = (key: string): string => {
    return createHash('sha256').update(key).digest('hex');
};

/**
 * Generates a secure random token.
 * Useful if we want to move away from UUIDs to opaque tokens.
 */
export const generateSecureToken = (length: number = 32): string => {
    return randomBytes(length).toString('hex');
};
