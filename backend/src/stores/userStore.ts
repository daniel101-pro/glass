import type { User, CreateUserData } from '../types/user.js';
import { AuthUtils } from '../utils/auth.js';
import { User as UserModel } from '../models/User.js';

/**
 * MongoDB-based user store
 */
class UserStore {
  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    // Check if email already exists
    const existingUser = await UserModel.findOne({ email: userData.email.toLowerCase() });
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const userId = AuthUtils.generateUserId();
    const passwordHash = await AuthUtils.hashPassword(userData.password);

    const userDoc = new UserModel({
      id: userId,
      email: userData.email.toLowerCase(),
      fullName: userData.fullName,
      passwordHash,
    });

    const savedUser = await userDoc.save();

    return {
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      passwordHash: savedUser.passwordHash,
      isEmailVerified: savedUser.isEmailVerified,
      verificationCode: savedUser.verificationCode || undefined,
      verificationCodeExpires: savedUser.verificationCodeExpires || undefined,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }

  /**
   * Find user by ID
   */
  async findById(userId: string): Promise<User | null> {
    const user = await UserModel.findOne({ id: userId });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      isEmailVerified: user.isEmailVerified,
      verificationCode: user.verificationCode || undefined,
      verificationCodeExpires: user.verificationCodeExpires || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Get user by ID (alias for findById)
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.findById(userId);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      isEmailVerified: user.isEmailVerified,
      verificationCode: user.verificationCode || undefined,
      verificationCodeExpires: user.verificationCodeExpires || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updates: Partial<Pick<User, 'fullName' | 'email'>>): Promise<User | null> {
    // If email is being updated, check for conflicts
    if (updates.email) {
      const existingUser = await UserModel.findOne({ 
        email: updates.email.toLowerCase(),
        id: { $ne: userId } // Exclude current user
      });
      
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    const user = await UserModel.findOneAndUpdate(
      { id: userId },
      { 
        ...updates, 
        email: updates.email?.toLowerCase() || undefined,
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      isEmailVerified: user.isEmailVerified,
      verificationCode: user.verificationCode || undefined,
      verificationCodeExpires: user.verificationCodeExpires || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ id: userId });
    return result.deletedCount > 0;
  }

  /**
   * Update verification code for user
   */
  async updateVerificationCode(userId: string, code: string, expires: Date): Promise<boolean> {
    const result = await UserModel.updateOne(
      { id: userId },
      { 
        verificationCode: code,
        verificationCodeExpires: expires,
        updatedAt: new Date()
      }
    );
    return result.modifiedCount > 0;
  }

  /**
   * Mark user email as verified
   */
  async markEmailAsVerified(userId: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { id: userId },
      { 
        isEmailVerified: true,
        $unset: { 
          verificationCode: "",
          verificationCodeExpires: ""
        },
        updatedAt: new Date()
      }
    );
    return result.modifiedCount > 0;
  }

  /**
   * Get all users (for admin purposes)
   */
  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find({});
    return users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      isEmailVerified: user.isEmailVerified,
      verificationCode: user.verificationCode || undefined,
      verificationCodeExpires: user.verificationCodeExpires || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}

// Export a singleton instance
export const userStore = new UserStore();