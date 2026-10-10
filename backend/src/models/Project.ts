import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectDocument extends Document {
  id: string;
  userId: string;
  name: string;
  description: string;
  category?: string;
  problemStatement?: string;
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
    constraints?: string[];
    assumptions?: string[];
    userRoles?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Web Application' },
    problemStatement: { type: String, default: '' },
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
      constraints: [{ type: String }],
      assumptions: [{ type: String }],
      userRoles: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);
