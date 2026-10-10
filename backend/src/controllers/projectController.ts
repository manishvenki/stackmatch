import { Request, Response } from 'express';
import { store } from '../services/store';
import { aiPlanningService } from '../services/aiPlanningService';
import { AuthenticatedRequest } from '../middleware/auth';

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const projects = await store.getProjects(userId);
    return res.json({
      success: true,
      data: projects
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch projects.'
    });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await store.getProjectById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found.`
      });
    }
    return res.json({
      success: true,
      data: project
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch project.'
    });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'usr_demo_01';
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Project name is required.'
      });
    }

    const project = await store.createProject(userId, name.trim(), description || '');
    return res.status(201).json({
      success: true,
      data: project
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to create project.'
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await store.updateProject(id, updates);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found.`
      });
    }

    return res.json({
      success: true,
      data: updated
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to update project.'
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteProject(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found.`
      });
    }

    return res.json({
      success: true,
      message: 'Project deleted successfully.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete project.'
    });
  }
};

// AI Planning Intelligence endpoints
export const analyzeIdea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Prompt content is required for idea analysis.'
      });
    }

    const project = await store.getProjectById(id);
    const projectName = project ? project.name : 'Project';
    const analysis = await aiPlanningService.analyzeIdea(prompt, projectName);

    // If project exists, update summary goals & target audience
    if (project) {
      await store.updateProject(id, {
        summary: {
          projectType: analysis.platformRequirements.join(' + ') || 'Web & Mobile',
          primaryUsers: analysis.targetUsers,
          industry: 'Software & Technology',
          keyFeatures: ['User Onboarding', 'Core Workflows', 'Role-Based Dashboard'],
          estimatedComplexity: 'Medium',
          estimatedTimeline: '2–4 months',
          goals: analysis.mainGoals,
          targetAudience: analysis.targetUsers,
          constraints: analysis.constraints,
          assumptions: analysis.assumptions,
          userRoles: analysis.targetUsers
        }
      });
    }

    return res.json({
      success: true,
      data: analysis
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to analyze idea.'
    });
  }
};

export const generatePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await store.getProjectById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found.`
      });
    }

    // Retrieve conversation history
    const messages = await store.getMessages(id);
    const promptText = messages.map(m => m.content).join(' ') || project.description || project.name;

    // Run AI planning intelligence
    const analysis = await aiPlanningService.analyzeIdea(promptText, project.name);
    const requirements = aiPlanningService.generateRequirements(id, analysis, promptText);
    const techStack = aiPlanningService.recommendTechStack(project, requirements);
    const comparisons = aiPlanningService.generateComparisons(project);
    const { architecture, roadmap } = aiPlanningService.generateArchitectureAndRoadmap(project, techStack);
    const resources = aiPlanningService.generateResources(techStack);
    const blueprint = aiPlanningService.generateBlueprint(project);

    // Save to store
    await store.setRequirements(id, requirements);
    await store.setTechnologies(id, techStack);
    await store.setComparisons(id, comparisons);
    await store.setArchitecture(id, architecture);
    await store.setRoadmap(id, roadmap);
    await store.setResources(id, resources);
    await store.setBlueprint(id, blueprint);

    // Update project state & summary
    const updatedProject = await store.updateProject(id, {
      currentStage: 'finalize',
      status: 'in-progress',
      summary: {
        projectType: analysis.platformRequirements.join(' + ') || 'Web + Mobile Application',
        primaryUsers: analysis.targetUsers,
        industry: 'Software & Technology',
        keyFeatures: requirements.slice(0, 4).map(r => r.title),
        estimatedComplexity: 'Medium',
        estimatedTimeline: '3–5 months',
        goals: analysis.mainGoals,
        targetAudience: analysis.targetUsers,
        constraints: analysis.constraints,
        assumptions: analysis.assumptions,
        userRoles: analysis.targetUsers
      }
    });

    return res.json({
      success: true,
      data: {
        project: updatedProject,
        analysis,
        requirements,
        techStack,
        comparisons,
        architecture,
        roadmap,
        resources,
        blueprint
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to synthesize project plan.'
    });
  }
};

// Domain endpoints
export const getRequirements = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reqs = await store.getRequirements(id);
    return res.json({ success: true, data: reqs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createRequirement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, type, priority, category } = req.body;

    if (!title || !description || !type || !priority) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, type, and priority are required.'
      });
    }

    const created = await store.addRequirement(id, {
      title,
      description,
      type,
      priority,
      category: category || 'General'
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateRequirement = async (req: Request, res: Response) => {
  try {
    const { id, reqId } = req.params;
    const updates = req.body;
    const updated = await store.updateRequirement(id, reqId, updates);

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Requirement not found.' });
    }

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteRequirement = async (req: Request, res: Response) => {
  try {
    const { id, reqId } = req.params;
    const deleted = await store.deleteRequirement(id, reqId);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Requirement not found.' });
    }

    return res.json({ success: true, message: 'Requirement deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getTechStack = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const techs = await store.getTechnologies(id);
    return res.json({ success: true, data: techs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getComparisons = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comparisons = await store.getComparisons(id);
    return res.json({ success: true, data: comparisons });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getArchitecture = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const nodes = await store.getArchitecture(id);
    return res.json({ success: true, data: nodes });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getRoadmap = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roadmap = await store.getRoadmap(id);
    return res.json({ success: true, data: roadmap });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getResources = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resources = await store.getResources(id);
    return res.json({ success: true, data: resources });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getBlueprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blueprint = await store.getBlueprint(id);
    if (!blueprint) {
      return res.status(404).json({ success: false, error: 'Blueprint not found.' });
    }
    return res.json({ success: true, data: blueprint });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
