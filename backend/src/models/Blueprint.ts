import mongoose, { Schema, Document } from 'mongoose';
import { ProjectBlueprint } from '../../../packages/types/src/index';

export interface IBlueprintDocument extends Document {
  projectId: string;
  userId: string;
  blueprint: ProjectBlueprint;
  createdAt: Date;
  updatedAt: Date;
}

const BlueprintSchema = new Schema<IBlueprintDocument>(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    blueprint: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const BlueprintModel = mongoose.models.Blueprint || mongoose.model<IBlueprintDocument>('Blueprint', BlueprintSchema);
