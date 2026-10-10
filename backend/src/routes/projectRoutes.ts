import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  analyzeIdea,
  generatePlan,
  getRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  getTechStack,
  getComparisons,
  getArchitecture,
  validateArchitecture,
  getProjectContext,
  getProjectRisks,
  getRoadmap,
  getResources,
  getBlueprint
} from '../controllers/projectController';
import { getMessages, postMessage } from '../controllers/messageController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Apply optionalAuth across project routes to identify authenticated requests
router.use(optionalAuth);

// Project collection & item routes
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

// AI Planning Intelligence endpoints
router.post('/:id/analyze-idea', analyzeIdea);
router.post('/:id/generate-plan', generatePlan);

// Conversation & message routes
router.get('/:id/messages', getMessages);
router.post('/:id/messages', postMessage);

// Project domain details
router.get('/:id/requirements', getRequirements);
router.post('/:id/requirements', createRequirement);
router.put('/:id/requirements/:reqId', updateRequirement);
router.delete('/:id/requirements/:reqId', deleteRequirement);

router.get('/:id/tech-stack', getTechStack);
router.get('/:id/comparisons', getComparisons);
router.get('/:id/architecture', getArchitecture);
router.get('/:id/architecture/validate', validateArchitecture);
router.get('/:id/context', getProjectContext);
router.get('/:id/insights/risks', getProjectRisks);
router.get('/:id/roadmap', getRoadmap);
router.get('/:id/resources', getResources);
router.get('/:id/blueprint', getBlueprint);

export default router;
