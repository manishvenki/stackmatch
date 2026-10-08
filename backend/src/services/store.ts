import bcrypt from 'bcryptjs';
import {
  User,
  Project,
  Requirement,
  Technology,
  TechComparisonGroup,
  ArchitectureNode,
  RoadmapPhase,
  ResourceItem,
  ProjectBlueprint,
  Message,
  Conversation
} from '../../../packages/types/src/index';
import {
  sampleProject,
  sampleRequirements,
  sampleTechnologies,
  sampleComparisons,
  sampleArchitecture,
  sampleRoadmap,
  sampleResources,
  sampleBlueprint,
  sampleInitialMessages
} from '../data/sampleProjectData';

interface StoredUser extends User {
  passwordHash: string;
}

class InMemoryStore {
  private users: Map<string, StoredUser> = new Map();
  private projects: Map<string, Project> = new Map();
  private requirements: Map<string, Requirement[]> = new Map();
  private conversations: Map<string, Message[]> = new Map();
  private technologies: Map<string, Technology[]> = new Map();
  private comparisons: Map<string, TechComparisonGroup> = new Map();
  private architectures: Map<string, ArchitectureNode[]> = new Map();
  private roadmaps: Map<string, RoadmapPhase[]> = new Map();
  private resources: Map<string, ResourceItem[]> = new Map();
  private blueprints: Map<string, ProjectBlueprint> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // Seed default demo user: demo@stackmatch.dev / password123
    const salt = bcrypt.genSaltSync(10);
    const demoUser: StoredUser = {
      id: 'usr_demo_01',
      name: 'Alex Rivera',
      email: 'demo@stackmatch.dev',
      role: 'founder',
      passwordHash: bcrypt.hashSync('password123', salt),
      createdAt: new Date().toISOString()
    };
    this.users.set(demoUser.id, demoUser);
    this.users.set(demoUser.email.toLowerCase(), demoUser);

    // Seed sample project
    this.projects.set(sampleProject.id, { ...sampleProject });
    this.requirements.set(sampleProject.id, [...sampleRequirements]);
    this.conversations.set(sampleProject.id, [...sampleInitialMessages]);
    this.technologies.set(sampleProject.id, [...sampleTechnologies]);
    this.comparisons.set(sampleProject.id, { ...sampleComparisons });
    this.architectures.set(sampleProject.id, [...sampleArchitecture]);
    this.roadmaps.set(sampleProject.id, [...sampleRoadmap]);
    this.resources.set(sampleProject.id, [...sampleResources]);
    this.blueprints.set(sampleProject.id, { ...sampleBlueprint });
  }

  // User methods
  public async createUser(name: string, email: string, passwordHash: string): Promise<User> {
    const existing = this.users.get(email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists');
    }
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user: StoredUser = {
      id,
      name,
      email: email.toLowerCase(),
      role: 'user',
      passwordHash,
      createdAt: new Date().toISOString()
    };
    this.users.set(id, user);
    this.users.set(email.toLowerCase(), user);
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public async findUserByEmail(email: string): Promise<StoredUser | null> {
    return this.users.get(email.toLowerCase()) || null;
  }

  public async findUserById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  // Project methods
  public async getProjects(userId?: string): Promise<Project[]> {
    const all = Array.from(this.projects.values());
    if (userId) {
      return all.filter((p) => p.userId === userId || p.userId === 'usr_demo_01');
    }
    return all;
  }

  public async getProjectById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  public async createProject(userId: string, name: string, description: string = ''): Promise<Project> {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newProject: Project = {
      id,
      userId,
      name,
      description,
      status: 'draft',
      currentStage: 'idea',
      summary: {
        projectType: 'Web & Mobile Application',
        primaryUsers: ['End Users', 'Administrators'],
        industry: 'Software',
        keyFeatures: ['User Onboarding', 'Core Workflow', 'Analytics Dashboard'],
        estimatedComplexity: 'Medium',
        estimatedTimeline: '2–4 months',
        goals: ['Launch minimum viable product', 'Validate key user journeys'],
        targetAudience: ['Target Customers', 'Operations Team']
      },
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, newProject);

    // Seed conversation for new project
    const initialMessage: Message = {
      id: `msg_${Date.now()}_1`,
      projectId: id,
      role: 'assistant',
      content: `Hi! I'm StackMatch. Tell me about "${name}". You can describe it in simple words — I'll take care of the technical details.`,
      timestamp: now,
      metadata: {
        stage: 'idea',
        suggestedResponses: [
          'It is a web portal for customers to request services',
          'It is a mobile app with real-time push alerts',
          'It requires payment collection and invoice tracking'
        ]
      }
    };
    this.conversations.set(id, [initialMessage]);

    // Seed cloned defaults for tech stack, roadmap, architecture, etc.
    this.requirements.set(id, [
      {
        id: `req_${Date.now()}_1`,
        projectId: id,
        title: 'Core Authentication & Permissions',
        description: 'Secure token authentication for regular users and administrative roles.',
        type: 'functional',
        priority: 'high',
        category: 'Security'
      },
      {
        id: `req_${Date.now()}_2`,
        projectId: id,
        title: 'Primary User Workflow',
        description: 'Guided flow allowing users to submit actions and view progress.',
        type: 'functional',
        priority: 'high',
        category: 'Operations'
      }
    ]);
    this.technologies.set(id, [...sampleTechnologies]);
    this.comparisons.set(id, { ...sampleComparisons });
    this.architectures.set(id, [...sampleArchitecture]);
    this.roadmaps.set(id, [...sampleRoadmap]);
    this.resources.set(id, [...sampleResources]);
    this.blueprints.set(id, {
      projectId: id,
      projectName: name,
      generatedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      version: '1.0.0-PROPOSAL',
      sections: sampleBlueprint.sections
    });

    return newProject;
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const existing = this.projects.get(id);
    if (!existing) return null;
    const updated: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.projects.set(id, updated);
    return updated;
  }

  public async deleteProject(id: string): Promise<boolean> {
    if (!this.projects.has(id)) return false;
    this.projects.delete(id);
    this.requirements.delete(id);
    this.conversations.delete(id);
    this.technologies.delete(id);
    this.comparisons.delete(id);
    this.architectures.delete(id);
    this.roadmaps.delete(id);
    this.resources.delete(id);
    this.blueprints.delete(id);
    return true;
  }

  // Conversation & Message methods
  public async getMessages(projectId: string): Promise<Message[]> {
    return this.conversations.get(projectId) || [];
  }

  public async addMessage(
    projectId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: { suggestedResponses?: string[]; stage?: 'idea' | 'requirements' | 'planning' | 'finalize' }
  ): Promise<Message> {
    const list = this.conversations.get(projectId) || [];
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      role,
      content,
      timestamp: new Date().toISOString(),
      metadata
    };
    list.push(newMessage);
    this.conversations.set(projectId, list);
    return newMessage;
  }

  // Project Domain specifics
  public async getRequirements(projectId: string): Promise<Requirement[]> {
    return this.requirements.get(projectId) || [];
  }

  public async addRequirement(projectId: string, req: Omit<Requirement, 'id' | 'projectId'>): Promise<Requirement> {
    const list = this.requirements.get(projectId) || [];
    const created: Requirement = {
      ...req,
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId
    };
    list.push(created);
    this.requirements.set(projectId, list);
    return created;
  }

  public async getTechnologies(projectId: string): Promise<Technology[]> {
    return this.technologies.get(projectId) || sampleTechnologies;
  }

  public async getComparisons(projectId: string): Promise<TechComparisonGroup> {
    return this.comparisons.get(projectId) || sampleComparisons;
  }

  public async getArchitecture(projectId: string): Promise<ArchitectureNode[]> {
    return this.architectures.get(projectId) || sampleArchitecture;
  }

  public async getRoadmap(projectId: string): Promise<RoadmapPhase[]> {
    return this.roadmaps.get(projectId) || sampleRoadmap;
  }

  public async getResources(projectId: string): Promise<ResourceItem[]> {
    return this.resources.get(projectId) || sampleResources;
  }

  public async getBlueprint(projectId: string): Promise<ProjectBlueprint | null> {
    return this.blueprints.get(projectId) || null;
  }
}

export const store = new InMemoryStore();
