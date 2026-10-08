import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectDocument extends Document {
  userId: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  currentStage: 'idea' | 'requirements' | 'planning' | 'finalize';
  summary?: {
    projectType: string;
    primaryUsers: string[];
    industry: string;
    keyFeatures: string[];
    estimatedComplexity: string;
    estimatedTimeline: string;
    goals: string[];
    targetAudience: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'in-progress', 'completed', 'archived'],
      default: 'draft',
    },
    currentStage: {
      type: String,
      enum: ['idea', 'requirements', 'planning', 'finalize'],
      default: 'idea',
    },
    summary: {
      projectType: { type: String, default: 'Web + Mobile Application' },
      primaryUsers: [{ type: String }],
      industry: { type: String, default: 'Software & Technology' },
      keyFeatures: [{ type: String }],
      estimatedComplexity: { type: String, default: 'Medium' },
      estimatedTimeline: { type: String, default: '3–6 months' },
      goals: [{ type: String }],
      targetAudience: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<IProjectDocument>('Project', ProjectSchema);
