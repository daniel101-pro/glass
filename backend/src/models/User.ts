import mongoose, { Schema, Document } from 'mongoose';

// Define the user document interface without extending our User type to avoid conflicts
export interface UserDocument extends Document {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
});

// Indexes are already created by the unique: true property above

export const User = mongoose.model<UserDocument>('User', userSchema);
