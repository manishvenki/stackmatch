import mongoose, { Schema, Document } from 'mongoose';

export interface IRequirementDocument extends Document {
  projectId: string;
  title: string;
  description: string;
  type: 'functional' | 'non-functional';
  priority: 'high' | 'medium' | 'low';
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema = new Schema<IRequirementDocument>(
  {
    projectId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['functional', 'non-functional'], required: true },
    priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
    category: { type: String, default: 'General' },
  },
  { timestamps: true }
);

export const RequirementModel = mongoose.model<IRequirementDocument>('Requirement', RequirementSchema);
