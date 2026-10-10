import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageSubdocument {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    suggestedResponses?: string[];
    stage?: string;
  };
}

export interface IConversationDocument extends Document {
  projectId: string;
  userId?: string;
  messages: IMessageSubdocument[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageSubdocument>(
  {
    id: { type: String, required: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
    metadata: {
      suggestedResponses: [{ type: String }],
      stage: { type: String },
    },
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversationDocument>(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.models.Conversation || mongoose.model<IConversationDocument>('Conversation', ConversationSchema);
