// utils.ts

/**
 * Generates a random hexadecimal string of the specified length.
 * @param length The desired length of the hex string.
 * @returns A random hex string of the given length.
 */
export function generateRandomHex(length: number): string {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
