import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel } from '../models/User';
import { ProjectModel } from '../models/Project';
import { ConversationModel } from '../models/Conversation';
import { BlueprintModel } from '../models/Blueprint';
import {
  User,
  UserOnboardingData,
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
  public async createUser(name: string, email: string, passwordHash: string, username?: string): Promise<User> {
    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new Error('User with this email already exists');
    }
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user: StoredUser = {
      id,
      name,
      username: username || name.toLowerCase().replace(/\s+/g, '_'),
      email: email.toLowerCase(),
      role: 'user',
      passwordHash,
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };
    this.users.set(id, user);
    this.users.set(email.toLowerCase(), user);

    if (mongoose.connection.readyState === 1) {
      try {
        await UserModel.create({
          name: user.name,
          username: user.username,
          email: user.email,
          passwordHash: user.passwordHash,
          role: user.role,
          onboardingCompleted: false
        });
      } catch (err: any) {
        console.warn('[Store] MongoDB user creation notice:', err.message);
      }
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public async findUserByEmail(email: string): Promise<StoredUser | null> {
    const mem = this.users.get(email.toLowerCase());
    if (mem) return mem;

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await UserModel.findOne({ email: email.toLowerCase() });
        if (doc) {
          const user: StoredUser = {
            id: (doc as any)._id?.toString() || (doc as any).id,
            name: doc.name,
            username: doc.username,
            email: doc.email,
            role: doc.role,
            passwordHash: doc.passwordHash,
            onboardingCompleted: doc.onboardingCompleted,
            onboardingResponses: doc.onboardingResponses,
            createdAt: doc.createdAt?.toISOString() || new Date().toISOString()
          };
          this.users.set(user.id, user);
          this.users.set(user.email.toLowerCase(), user);
          return user;
        }
      } catch (_) {}
    }
    return null;
  }

  public async findUserById(id: string): Promise<User | null> {
    const mem = this.users.get(id);
    if (mem) {
      const { passwordHash: _, ...safeUser } = mem;
      return safeUser;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await UserModel.findById(id);
        if (doc) {
          const user: StoredUser = {
            id: doc._id.toString(),
            name: doc.name,
            username: doc.username,
            email: doc.email,
            role: doc.role,
            passwordHash: doc.passwordHash,
            onboardingCompleted: doc.onboardingCompleted,
            onboardingResponses: doc.onboardingResponses,
            createdAt: doc.createdAt?.toISOString() || new Date().toISOString()
          };
          this.users.set(user.id, user);
          this.users.set(user.email.toLowerCase(), user);
          const { passwordHash: _, ...safeUser } = user;
          return safeUser;
        }
      } catch (_) {}
    }
    return null;
  }

  public async updateUserOnboarding(userId: string, data: UserOnboardingData): Promise<User | null> {
    const mem = this.users.get(userId);
    if (mem) {
      mem.onboardingCompleted = true;
      mem.onboardingResponses = { ...data, completedAt: new Date().toISOString() };
      this.users.set(userId, mem);
      this.users.set(mem.email.toLowerCase(), mem);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        await UserModel.findOneAndUpdate(
          { $or: [{ _id: mongoose.isValidObjectId(userId) ? userId : undefined }, { email: mem?.email }] },
          { onboardingCompleted: true, onboardingResponses: { ...data, completedAt: new Date().toISOString() } }
        );
      } catch (err: any) {
        console.warn('[Store] MongoDB onboarding update notice:', err.message);
      }
    }

    return this.findUserById(userId);
  }

  // Project methods
  public async getProjects(userId?: string): Promise<Project[]> {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = userId ? { userId } : {};
        const docs = await ProjectModel.find(query);
        for (const doc of docs) {
          if (!this.projects.has(doc.id)) {
            this.projects.set(doc.id, {
              id: doc.id,
              userId: doc.userId,
              name: doc.name,
              description: doc.description,
              category: doc.category,
              problemStatement: doc.problemStatement,
              status: doc.status as any,
              currentStage: doc.currentStage as any,
              summary: doc.summary as any,
              createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
              updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString()
            });
          }
        }
      } catch (_) {}
    }
    if (userId) {
      return Array.from(this.projects.values()).filter((p) => p.userId === userId || (p.userId === 'usr_demo_01' && userId === 'usr_demo_01'));
    }
    return Array.from(this.projects.values());
  }

  public async getProjectById(id: string): Promise<Project | null> {
    if (this.projects.has(id)) {
      return this.projects.get(id) || null;
    }
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await ProjectModel.findOne({ id });
        if (doc) {
          const proj: Project = {
            id: doc.id,
            userId: doc.userId,
            name: doc.name,
            description: doc.description,
            category: doc.category,
            problemStatement: doc.problemStatement,
            status: doc.status as any,
            currentStage: doc.currentStage as any,
            summary: doc.summary as any,
            createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString()
          };
          this.projects.set(id, proj);
          return proj;
        }
      } catch (_) {}
    }
    return null;
  }

  public async createProject(
    userId: string,
    name: string,
    description: string = '',
    options?: {
      problemStatement?: string;
      category?: string;
      primaryUsers?: string[];
      goals?: string[];
      objectives?: string[];
      initialRequirements?: Array<{
        title: string;
        description: string;
        type?: 'functional' | 'non-functional';
        priority?: 'high' | 'medium' | 'low';
        category?: string;
      }>;
      status?: 'draft' | 'in-progress' | 'completed';
    }
  ): Promise<Project> {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const primaryUsers = options?.primaryUsers && options.primaryUsers.length > 0
      ? options.primaryUsers
      : ['End Users', 'Administrators'];
    const goals = options?.goals || options?.objectives || ['Launch minimum viable product', 'Validate key user journeys'];

    const newProject: Project = {
      id,
      userId,
      name,
      description,
      category: options?.category || 'Web Application',
      problemStatement: options?.problemStatement || description,
      status: (options?.status as any) || 'draft',
      currentStage: 'idea',
      summary: {
        projectType: options?.category || 'Web & Mobile Application',
        primaryUsers,
        industry: options?.category || 'Software',
        keyFeatures: ['User Onboarding', 'Core Workflow', 'Analytics Dashboard'],
        estimatedComplexity: 'Medium',
        estimatedTimeline: '2–4 months',
        goals,
        targetAudience: primaryUsers,
        problemStatement: options?.problemStatement || description,
        category: options?.category || 'Web Application',
        objectives: goals
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

    // Initial requirements
    if (options?.initialRequirements && options.initialRequirements.length > 0) {
      const customReqs = options.initialRequirements.map((r, idx) => ({
        id: `req_${Date.now()}_${idx + 1}`,
        projectId: id,
        title: r.title,
        description: r.description,
        type: (r.type as any) || 'functional',
        priority: (r.priority as any) || 'high',
        category: r.category || 'Core Scope',
        isMvpScope: true
      }));
      this.requirements.set(id, customReqs);
    } else {
      this.requirements.set(id, [
        {
          id: `req_${Date.now()}_1`,
          projectId: id,
          title: 'Core Authentication & Permissions',
          description: 'Secure token authentication for regular users and administrative roles.',
          type: 'functional',
          priority: 'high',
          category: 'Security',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_2`,
          projectId: id,
          title: 'Primary User Workflow',
          description: 'Guided flow allowing users to submit actions and view progress.',
          type: 'functional',
          priority: 'high',
          category: 'Operations',
          isMvpScope: true
        }
      ]);
    }

    this.technologies.set(id, [...sampleTechnologies]);
    this.comparisons.set(id, { ...sampleComparisons });
    this.architectures.set(id, [...sampleArchitecture]);
    this.roadmaps.set(id, [...sampleRoadmap]);
    this.resources.set(id, [...sampleResources]);

    if (mongoose.connection.readyState === 1) {
      try {
        await ProjectModel.create({
          id: newProject.id,
          userId: newProject.userId,
          name: newProject.name,
          description: newProject.description,
          category: newProject.category,
          problemStatement: newProject.problemStatement,
          status: newProject.status,
          currentStage: newProject.currentStage,
          summary: newProject.summary,
        });
        await ConversationModel.create({
          projectId: id,
          userId,
          messages: [initialMessage],
        });
      } catch (err: any) {
        console.warn('[Store] MongoDB project creation notice:', err.message);
      }
    }

    return newProject;
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const existing = this.projects.get(id);
    if (!existing) return null;

    const mergedSummary = updates.summary
      ? { ...existing.summary, ...updates.summary }
      : existing.summary;

    const updated: Project = {
      ...existing,
      ...updates,
      category: updates.category || updates.summary?.category || existing.category,
      problemStatement: updates.problemStatement || updates.summary?.problemStatement || existing.problemStatement,
      summary: mergedSummary,
      updatedAt: new Date().toISOString()
    };
    this.projects.set(id, updated);

    if (mongoose.connection.readyState === 1) {
      try {
        await ProjectModel.findOneAndUpdate(
          { id },
          {
            name: updated.name,
            description: updated.description,
            category: updated.category,
            problemStatement: updated.problemStatement,
            status: updated.status,
            currentStage: updated.currentStage,
            summary: updated.summary,
            updatedAt: new Date(),
          }
        );
      } catch (err: any) {
        console.warn('[Store] MongoDB project update notice:', err.message);
      }
    }

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

    if (mongoose.connection.readyState === 1) {
      try {
        await ProjectModel.findOneAndDelete({ id });
        await ConversationModel.findOneAndDelete({ projectId: id });
        await BlueprintModel.findOneAndDelete({ projectId: id });
      } catch (err: any) {
        console.warn('[Store] MongoDB project delete notice:', err.message);
      }
    }

    return true;
  }

  // Conversation & Message methods
  public async getMessages(projectId: string): Promise<Message[]> {
    const mem = this.conversations.get(projectId);
    if (mem && mem.length > 0) return mem;

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await ConversationModel.findOne({ projectId });
        if (doc && doc.messages?.length) {
          const list = doc.messages.map((m: any) => ({
            id: m.id,
            projectId,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
            metadata: m.metadata
          }));
          this.conversations.set(projectId, list);
          return list;
        }
      } catch (_) {}
    }

    return mem || [];
  }

  public async addMessage(
    projectId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: any
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

    if (mongoose.connection.readyState === 1) {
      try {
        await ConversationModel.findOneAndUpdate(
          { projectId },
          { $push: { messages: newMessage } },
          { upsert: true }
        );
      } catch (err: any) {
        console.warn('[Store] MongoDB addMessage notice:', err.message);
      }
    }

    return newMessage;
  }

  // Project Domain specifics
  public async getRequirements(projectId: string): Promise<Requirement[]> {
    return this.requirements.get(projectId) || [];
  }

  public async setRequirements(projectId: string, reqs: Requirement[]): Promise<Requirement[]> {
    this.requirements.set(projectId, reqs);
    return reqs;
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

  public async updateRequirement(projectId: string, reqId: string, updates: Partial<Requirement>): Promise<Requirement | null> {
    const list = this.requirements.get(projectId) || [];
    const idx = list.findIndex((r) => r.id === reqId);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    this.requirements.set(projectId, list);
    return updated;
  }

  public async deleteRequirement(projectId: string, reqId: string): Promise<boolean> {
    const list = this.requirements.get(projectId) || [];
    const filtered = list.filter((r) => r.id !== reqId);
    if (filtered.length === list.length) return false;
    this.requirements.set(projectId, filtered);
    return true;
  }

  public async getTechnologies(projectId: string): Promise<Technology[]> {
    return this.technologies.get(projectId) || sampleTechnologies;
  }

  public async setTechnologies(projectId: string, techs: Technology[]): Promise<Technology[]> {
    this.technologies.set(projectId, techs);
    return techs;
  }

  public async getComparisons(projectId: string): Promise<TechComparisonGroup> {
    return this.comparisons.get(projectId) || sampleComparisons;
  }

  public async setComparisons(projectId: string, comp: TechComparisonGroup): Promise<TechComparisonGroup> {
    this.comparisons.set(projectId, comp);
    return comp;
  }

  public async getArchitecture(projectId: string): Promise<ArchitectureNode[]> {
    return this.architectures.get(projectId) || sampleArchitecture;
  }

  public async setArchitecture(projectId: string, nodes: ArchitectureNode[]): Promise<ArchitectureNode[]> {
    this.architectures.set(projectId, nodes);
    return nodes;
  }

  public async getRoadmap(projectId: string): Promise<RoadmapPhase[]> {
    return this.roadmaps.get(projectId) || sampleRoadmap;
  }

  public async setRoadmap(projectId: string, phases: RoadmapPhase[]): Promise<RoadmapPhase[]> {
    this.roadmaps.set(projectId, phases);
    return phases;
  }

  public async getResources(projectId: string): Promise<ResourceItem[]> {
    return this.resources.get(projectId) || sampleResources;
  }

  public async setResources(projectId: string, res: ResourceItem[]): Promise<ResourceItem[]> {
    this.resources.set(projectId, res);
    return res;
  }

  public async getBlueprint(projectId: string): Promise<ProjectBlueprint | null> {
    const project = await this.getProjectById(projectId);
    if (!project) return null;

    const reqs = this.requirements.get(projectId) || [];
    const techs = this.technologies.get(projectId) || [];
    const arch = this.architectures.get(projectId) || [];
    const roadmap = this.roadmaps.get(projectId) || [];
    const resources = this.resources.get(projectId) || [];

    const checklist = [
      { id: 'chk_1', category: 'Scope & Requirements', title: 'Functional requirements scoped and prioritized', completed: reqs.length > 0 },
      { id: 'chk_2', category: 'Scope & Requirements', title: 'Target users & role-based permissions documented', completed: (project.summary?.primaryUsers?.length || 0) > 0 },
      { id: 'chk_3', category: 'Architecture', title: 'Multi-tier system topology & components defined', completed: arch.length > 0 },
      { id: 'chk_4', category: 'Architecture', title: 'Technology selections approved with suitability scores', completed: techs.length > 0 },
      { id: 'chk_5', category: 'Security', title: 'Token auth & secret protection strategy established', completed: true },
      { id: 'chk_6', category: 'Roadmap', title: 'Phase-by-phase delivery milestones & timelines mapped', completed: roadmap.length > 0 },
      { id: 'chk_7', category: 'Quality & Testing', title: 'Acceptance criteria defined for critical user stories', completed: reqs.some(r => r.acceptanceCriteria && r.acceptanceCriteria.length > 0) },
      { id: 'chk_8', category: 'Operations', title: 'Deployment environment & container strategy specified', completed: true },
      { id: 'chk_9', category: 'Risk Mitigation', title: 'Technical bottlenecks and mitigations cataloged', completed: true },
      { id: 'chk_10', category: 'Team Readiness', title: 'Official documentation and learning guides curated', completed: resources.length > 0 }
    ];

    const dynamicSections = [
      {
        title: 'Project Overview & Executive Summary',
        description: project.description || 'Comprehensive executive brief outlining product mission and delivery window.',
        status: 'ready' as const
      },
      {
        title: 'Problem Statement & Target Users',
        description: project.problemStatement || project.summary?.problemStatement || `Targeted towards: ${(project.summary?.primaryUsers || ['End Users']).join(', ')}`,
        status: 'ready' as const
      },
      {
        title: 'Requirements & Acceptance Criteria',
        description: `${reqs.length} scoped requirements (${reqs.filter(r => r.type === 'functional').length} functional, ${reqs.filter(r => r.type === 'non-functional').length} non-functional).`,
        status: 'ready' as const
      },
      {
        title: 'Selected Technology Stack & Rationale',
        description: `${techs.length} curated technologies with suitability scores and integration guidance.`,
        status: 'ready' as const
      },
      {
        title: 'System Architecture Topography',
        description: `${arch.length} structural tiers spanning client, API, data persistence, and external services.`,
        status: 'ready' as const
      },
      {
        title: 'Sequential Development Roadmap',
        description: `${roadmap.length} delivery phases with measurable acceptance criteria and milestone prerequisites.`,
        status: 'ready' as const
      },
      {
        title: 'Technical Risks & Mitigations',
        description: 'Comprehensive bottleneck analysis with practical engineering safeguards.',
        status: 'ready' as const
      },
      {
        title: 'Official Learning Resources',
        description: `${resources.length} verified documentation links and engineering guides.`,
        status: 'ready' as const
      },
      {
        title: 'Implementation Readiness Checklist',
        description: `${checklist.filter(c => c.completed).length} of ${checklist.length} production readiness criteria verified.`,
        status: 'ready' as const
      }
    ];

    const dynamicBlueprint: ProjectBlueprint = {
      projectId,
      projectName: project.name,
      description: project.description,
      problemStatement: project.problemStatement || project.summary?.problemStatement || 'Not specified',
      category: project.category || project.summary?.category || project.summary?.industry || 'Web Application',
      objectives: project.summary?.goals || project.summary?.objectives || ['Launch minimum viable product'],
      targetAudience: project.summary?.targetAudience || project.summary?.primaryUsers || ['General Users'],
      primaryUsers: project.summary?.primaryUsers || ['End Users'],
      summary: project.summary,
      requirements: reqs,
      technologies: techs,
      architectureNodes: arch,
      roadmapPhases: roadmap,
      resources,
      checklist,
      sections: dynamicSections,
      generatedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      version: '1.0.0-PROPOSAL',
      lastUpdated: project.updatedAt || new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      try {
        await BlueprintModel.findOneAndUpdate(
          { projectId },
          { blueprint: dynamicBlueprint, userId: project.userId },
          { upsert: true }
        );
      } catch (_) {}
    }

    return dynamicBlueprint;
  }

  public async setBlueprint(projectId: string, bp: ProjectBlueprint): Promise<ProjectBlueprint> {
    this.blueprints.set(projectId, bp);
    return bp;
  }
}

export const store = new InMemoryStore();
