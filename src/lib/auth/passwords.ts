import crypto from 'crypto';

/**
 * Secure password hashing using PBKDF2 with SHA-512 and random salt.
 * No plaintext passwords are ever stored.
 */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hashToVerify, 'hex'));
}
