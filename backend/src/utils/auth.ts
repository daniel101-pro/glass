import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getEnv } from '../config/env.js';
import type { User, UserResponse, AuthTokens } from '../types/user.js';

const env = getEnv();

export class AuthUtils {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = env.BCRYPT_ROUNDS;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare a password with a hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT token for a user
   */
  static generateTokens(userId: string): AuthTokens {
    const payload = { userId };
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate a unique user ID
   */
  static generateUserId(): string {
    return uuidv4();
  }

  /**
   * Convert User to UserResponse (removes sensitive data)
   */
  static toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

