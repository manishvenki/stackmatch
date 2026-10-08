export type ProjectStage = 'idea' | 'requirements' | 'planning' | 'finalize';

export type ProjectStatus = 'draft' | 'in-progress' | 'completed' | 'archived';

export type RequirementType = 'functional' | 'non-functional';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProjectSummary {
  projectType: string;
  primaryUsers: string[];
  industry: string;
  keyFeatures: string[];
  estimatedComplexity: 'Low' | 'Medium' | 'High';
  estimatedTimeline: string;
  goals: string[];
  targetAudience: string[];
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  currentStage: ProjectStage;
  summary?: ProjectSummary;
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: RequirementType;
  priority: PriorityLevel;
  category?: string;
}

export interface TechKeyInfo {
  category: string;
  type: string;
  license: string;
  learningCurve: 'Easy' | 'Medium' | 'Hard';
  scalability: 'Good' | 'High' | 'Very High' | 'Excellent';
  ecosystem: 'Moderate' | 'High' | 'Very High';
}

export interface TechMetrics {
  popularity: number; // 0 to 100
  easeOfLearning: number; // 0 to 100
  scalability: number; // 0 to 100
  ecosystem: number; // 0 to 100
}

export interface Technology {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Authentication' | 'Payments' | 'Deployment' | 'Mobile' | 'Storage' | 'Monitoring';
  tagline: string;
  description: string;
  matchScore: number;
  isRecommended?: boolean;
  keyInfo: TechKeyInfo;
  metrics: TechMetrics;
  whyRecommended: string[];
  benefits: string[];
  tradeOffs: string[];
  alternatives: string[];
  realWorldUsage: string;
  learningResourcesCount?: number;
}

export interface ComparisonItem {
  name: string;
  matchScore: number;
  dataStructure?: string;
  relationships?: string;
  scalability: string;
  learningCurve: string;
  bestFor: string;
  realWorldUsage: string;
  community: string;
  isRecommended?: boolean;
}

export interface TechComparisonGroup {
  category: string;
  title: string;
  technologies: ComparisonItem[];
}

export interface ArchitectureNode {
  id: string;
  name: string;
  layer: 'client' | 'api' | 'data' | 'services' | 'external';
  layerTitle: string;
  technology: string;
  description: string;
  iconName: string;
  connectsTo: string[];
}

export interface RoadmapDeliverable {
  title: string;
  completed: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  deliverables: RoadmapDeliverable[];
}

export type ResourceCategory = 'Official Documentation' | 'YouTube' | 'Tutorials' | 'Examples' | 'Guides';

export interface ResourceItem {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  technology: string;
  url: string;
  readTimeOrDuration?: string;
}

export interface BlueprintSection {
  title: string;
  description: string;
  status: 'included' | 'ready';
}

export interface ProjectBlueprint {
  projectId: string;
  projectName: string;
  generatedDate: string;
  version: string;
  sections: BlueprintSection[];
}

export interface MessageMetadata {
  suggestedResponses?: string[];
  stage?: ProjectStage;
}

export interface Message {
  id: string;
  projectId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: MessageMetadata;
}

export interface Conversation {
  id: string;
  projectId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// API Response envelopes
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
