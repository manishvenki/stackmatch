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
  problemStatement?: string;
  category?: string;
  objectives?: string[];
  constraints?: string[];
  assumptions?: string[];
  exclusions?: string[];
  userRoles?: string[];
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  currentStage: ProjectStage;
  category?: string;
  problemStatement?: string;
  summary?: ProjectSummary;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  problemStatement?: string;
  category?: string;
  primaryUsers?: string[];
  goals?: string[];
  objectives?: string[];
  initialRequirements?: Array<{
    title: string;
    description: string;
    type?: RequirementType;
    priority?: PriorityLevel;
    category?: string;
  }>;
  status?: ProjectStatus;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  currentStage?: ProjectStage;
  category?: string;
  problemStatement?: string;
  summary?: Partial<ProjectSummary>;
}

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: RequirementType;
  priority: PriorityLevel;
  category?: string;
  userStory?: string;
  acceptanceCriteria?: string[];
  isMvpScope?: boolean;
}

export interface TechKeyInfo {
  category: string;
  type: string;
  license: string;
  learningCurve: 'Easy' | 'Medium' | 'Hard';
  scalability: 'Good' | 'High' | 'Very High' | 'Excellent';
  ecosystem: 'Moderate' | 'High' | 'Very High';
  costProfile?: 'Low / Open-Source' | 'Moderate / Tiered' | 'High / Enterprise';
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
  matchScore: number; // StackMatch Suitability Assessment
  isRecommended?: boolean;
  keyInfo: TechKeyInfo;
  metrics: TechMetrics;
  whyRecommended: string[];
  benefits: string[];
  tradeOffs: string[];
  alternatives: string[];
  realWorldUsage: string;
  officialDocsUrl?: string;
  learningResourcesCount?: number;
  roleInArchitecture?: string;
  integrationConsiderations?: string[];
  confidenceStatus?: 'Verified Match' | 'Recommended Estimate' | 'Alternative Option';
  scoringCriteriaExplanation?: string;
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
  tradeOffs?: string;
}

export interface TechComparisonGroup {
  category: string;
  title: string;
  technologies: ComparisonItem[];
  availableCategories?: string[];
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

export type ValidationSeverity = 'info' | 'warning' | 'critical';

export interface ArchitectureValidationFinding {
  id: string;
  severity: ValidationSeverity;
  category: 'compatibility' | 'redundancy' | 'missing-layer' | 'security' | 'infrastructure' | 'monitoring';
  title: string;
  description: string;
  consequence: string;
  actionableSuggestion: string;
  affectedTechnologies?: string[];
}

export interface ArchitectureValidationReport {
  projectId: string;
  status: 'consistent' | 'warnings_detected' | 'critical_issues';
  score: number; // 0 - 100 consistency score
  summary: string;
  findings: ArchitectureValidationFinding[];
  lastValidatedAt: string;
}

export type RiskSeverity = 'low' | 'medium' | 'high';

export interface ProjectRiskItem {
  id: string;
  category: 'technical' | 'dependency' | 'integration' | 'security' | 'bottleneck' | 'maintenance';
  title: string;
  severity: RiskSeverity;
  likelihood: 'low' | 'medium' | 'high';
  impact: string;
  practicalMitigation: string;
}

export interface ProjectComplexityInsight {
  overallComplexity: 'Low' | 'Medium' | 'High';
  score: number; // 0-100
  confidenceLevel: 'High' | 'Moderate' | 'Limited Data (Assumptions Stated)';
  keyDrivers: string[];
  bottlenecks: string[];
  testingRequirements: string[];
  deploymentConsiderations: string[];
  risks: ProjectRiskItem[];
}

export interface ProjectContext {
  projectId: string;
  projectName: string;
  originalIdea: string;
  problemStatement: string;
  targetUsers: string[];
  platforms: string[];
  budgetEstimate: string;
  timelineEstimate: string;
  complexityLevel: 'Low' | 'Medium' | 'High';
  complexityFactors: string[];
  functionalRequirementsCount: number;
  nonFunctionalRequirementsCount: number;
  selectedTechnologies: string[];
  knownConstraints: string[];
  unresolvedQuestions: string[];
  assumptions: string[];
}

export interface RoadmapDeliverable {
  title: string;
  completed: boolean;
  priority?: PriorityLevel;
  acceptanceCriteria?: string[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  objective?: string;
  prerequisites?: string[];
  deliverables: RoadmapDeliverable[];
  dependencies?: string[];
  potentialRisks?: string[];
}

export type ResourceCategory = 'Official Documentation' | 'YouTube' | 'Tutorials' | 'Examples' | 'Guides';

export interface ResourceItem {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  technology: string;
  url: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  relevanceReason?: string;
  readTimeOrDuration?: string;
  isVerified?: boolean;
}

export interface BlueprintSection {
  title: string;
  description: string;
  status: 'included' | 'ready';
}

export interface BlueprintChecklistItem {
  id: string;
  category: string;
  title: string;
  completed: boolean;
}

export interface ProjectBlueprint {
  projectId: string;
  projectName: string;
  generatedDate: string;
  version: string;
  sections: BlueprintSection[];
  description?: string;
  problemStatement?: string;
  category?: string;
  objectives?: string[];
  targetAudience?: string[];
  primaryUsers?: string[];
  summary?: ProjectSummary;
  requirements?: Requirement[];
  technologies?: Technology[];
  architectureNodes?: ArchitectureNode[];
  roadmapPhases?: RoadmapPhase[];
  risks?: ProjectRiskItem[];
  resources?: ResourceItem[];
  checklist?: BlueprintChecklistItem[];
  lastUpdated?: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  context?: string;
  options: string[];
}

export interface IdeaAnalysisResult {
  problemStatement: string;
  targetUsers: string[];
  mainGoals: string[];
  proposedSolution: string;
  platformRequirements: string[];
  constraints: string[];
  assumptions: string[];
  unresolvedQuestions: string[];
  followUpQuestions: FollowUpQuestion[];
}

export interface MessageMetadata {
  suggestedResponses?: string[];
  stage?: ProjectStage;
  followUpQuestion?: FollowUpQuestion;
  analysisSummary?: Partial<IdeaAnalysisResult>;
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
