import type { WaitlistEntry, CreateWaitlistData } from '../types/waitlist.js';
import { Waitlist as WaitlistModel } from '../models/Waitlist.js';

/**
 * MongoDB-based waitlist store
 */
class WaitlistStore {
  /**
   * Add email to waitlist
   */
  async addEmail(data: CreateWaitlistData): Promise<WaitlistEntry> {
    // Check if email already exists
    const existing = await WaitlistModel.findOne({ email: data.email.toLowerCase() });
    
    if (existing) {
      throw new Error('Email already exists in waitlist');
    }

    const entry = new WaitlistModel({
      email: data.email.toLowerCase(),
    });

    const savedEntry = await entry.save();

    return {
      id: String(savedEntry._id),
      email: savedEntry.email,
      createdAt: savedEntry.createdAt,
      updatedAt: savedEntry.updatedAt,
    };
  }

  /**
   * Get all waitlist entries
   */
  async getAllEntries(): Promise<WaitlistEntry[]> {
    const entries = await WaitlistModel.find({}).sort({ createdAt: -1 });
    
    return entries.map(entry => ({
      id: String(entry._id),
      email: entry.email,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));
  }

  /**
   * Get entry by email
   */
  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    const entry = await WaitlistModel.findOne({ email: email.toLowerCase() });
    
    if (!entry) return null;

    return {
      id: String(entry._id),
      email: entry.email,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }

  /**
   * Delete entry by ID
   */
  async deleteEntry(id: string): Promise<boolean> {
    const result = await WaitlistModel.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Get waitlist count
   */
  async getCount(): Promise<number> {
    return await WaitlistModel.countDocuments({});
  }
}

// Export a singleton instance
export const waitlistStore = new WaitlistStore();

