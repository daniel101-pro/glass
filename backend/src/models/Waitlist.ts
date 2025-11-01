import mongoose, { Schema, Document } from 'mongoose';

export interface WaitlistDocument extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const waitlistSchema = new Schema<WaitlistDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

export const Waitlist = mongoose.model<WaitlistDocument>('Waitlist', waitlistSchema);

