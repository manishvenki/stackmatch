import mongoose, { Schema, Document } from 'mongoose';
import { UserOnboardingData } from '../../../packages/types/src/index';

export interface IUserDocument extends Document {
  name: string;
  username?: string;
  email: string;
  passwordHash: string;
  role: string;
  onboardingCompleted: boolean;
  onboardingResponses?: UserOnboardingData;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'user' },
    onboardingCompleted: { type: Boolean, default: false },
    onboardingResponses: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
