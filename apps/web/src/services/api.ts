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
  Message
} from '../types';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string) || '/api/v1';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('sm_auth_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('sm_auth_token', token);
    } else {
      localStorage.removeItem('sm_auth_token');
    }
  }

  public getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutDuration = 20000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers
      });

      clearTimeout(timeoutId);
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || `HTTP error ${res.status}`);
      }

      return json.data !== undefined ? json.data : json;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      console.warn(`API call ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // Auth
  public async login(email: string, password: string):Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data;
  }

  public async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    this.setToken(data.token);
    return data;
  }

  public async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  public logout() {
    this.setToken(null);
  }

  // Projects
  public async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  public async getProjectById(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  public async createProject(name: string, description?: string): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  public async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  // Messages
  public async getMessages(projectId: string): Promise<Message[]> {
    return this.request<Message[]>(`/projects/${projectId}/messages`);
  }

  public async sendMessage(projectId: string, content: string): Promise<{ userMessage: Message; assistantMessage: Message }> {
    return this.request<{ userMessage: Message; assistantMessage: Message }>(`/projects/${projectId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  // Phase 2 AI Planning Intelligence
  public async analyzeIdea(projectId: string, prompt: string): Promise<any> {
    return this.request(`/projects/${projectId}/analyze-idea`, {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }

  public async generatePlan(projectId: string): Promise<any> {
    return this.request(`/projects/${projectId}/generate-plan`, {
      method: 'POST'
    });
  }

  // Domain queries
  public async getRequirements(projectId: string): Promise<Requirement[]> {
    return this.request<Requirement[]>(`/projects/${projectId}/requirements`);
  }

  public async createRequirement(projectId: string, req: Omit<Requirement, 'id' | 'projectId'>): Promise<Requirement> {
    return this.request<Requirement>(`/projects/${projectId}/requirements`, {
      method: 'POST',
      body: JSON.stringify(req)
    });
  }

  public async updateRequirement(projectId: string, reqId: string, updates: Partial<Requirement>): Promise<Requirement> {
    return this.request<Requirement>(`/projects/${projectId}/requirements/${reqId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  public async deleteRequirement(projectId: string, reqId: string): Promise<void> {
    await this.request(`/projects/${projectId}/requirements/${reqId}`, {
      method: 'DELETE'
    });
  }

  public async getTechStack(projectId: string): Promise<Technology[]> {
    return this.request<Technology[]>(`/projects/${projectId}/tech-stack`);
  }

  public async getComparisons(projectId: string): Promise<TechComparisonGroup> {
    return this.request<TechComparisonGroup>(`/projects/${projectId}/comparisons`);
  }

  public async getArchitecture(projectId: string): Promise<ArchitectureNode[]> {
    return this.request<ArchitectureNode[]>(`/projects/${projectId}/architecture`);
  }

  public async getRoadmap(projectId: string): Promise<RoadmapPhase[]> {
    return this.request<RoadmapPhase[]>(`/projects/${projectId}/roadmap`);
  }

  public async getResources(projectId: string): Promise<ResourceItem[]> {
    return this.request<ResourceItem[]>(`/projects/${projectId}/resources`);
  }

  public async getBlueprint(projectId: string): Promise<ProjectBlueprint> {
    return this.request<ProjectBlueprint>(`/projects/${projectId}/blueprint`);
  }

  public async getProjectPlan(projectId: string) {
    const [requirements, technologies, comparisons, architecture, roadmap, resources, blueprint] = await Promise.allSettled([
      this.getRequirements(projectId),
      this.getTechStack(projectId),
      this.getComparisons(projectId),
      this.getArchitecture(projectId),
      this.getRoadmap(projectId),
      this.getResources(projectId),
      this.getBlueprint(projectId),
    ]);
    return {
      requirements: requirements.status === 'fulfilled' ? requirements.value : [],
      technologies: technologies.status === 'fulfilled' ? technologies.value : [],
      comparisons: comparisons.status === 'fulfilled' ? comparisons.value : null,
      architecture: architecture.status === 'fulfilled' ? architecture.value : [],
      roadmap: roadmap.status === 'fulfilled' ? roadmap.value : [],
      resources: resources.status === 'fulfilled' ? resources.value : [],
      blueprint: blueprint.status === 'fulfilled' ? blueprint.value : null,
    };
  }
}

export const api = new ApiClient();
