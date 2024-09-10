import * as bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes and verifies a password using bcrypt with a salt.
 */
export const passwordEncoder = {
  /**
   * Hashes a plain text password.
   *
   * @param password - The plain text password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  async hash(password: string): Promise<string> {
    if (password.startsWith('$2a$') || password.startsWith('$2b$')) {
      return password;
    }
    if (password && password.length < 40) {
      return await bcryptjs.hash(password, SALT_ROUNDS);
    }
    throw new Error(
      'Password must be provided and be less than 40 characters.',
    );
  },

  /**
   * Verifies a plain text password against the hashed password.
   *
   * @param password - The plain text password.
   * @param hash - The hashed password.
   * @returns A promise that resolves to a boolean indicating if the password matches the hash.
   */
  async verify(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      throw new Error('Both password and hash must be provided.');
    }
    return await bcryptjs.compare(password, hash);
  },
};
