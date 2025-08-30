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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
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
   * Get all users (for admin purposes)
   */
  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find({});
    return users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}

// Export a singleton instance
export const userStore = new UserStore();