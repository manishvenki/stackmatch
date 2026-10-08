import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getRequirements,
  createRequirement,
  getTechStack,
  getComparisons,
  getArchitecture,
  getRoadmap,
  getResources,
  getBlueprint
} from '../controllers/projectController';
import { getMessages, postMessage } from '../controllers/messageController';

const router = Router();

// Project collection & item routes
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

// Conversation & message routes
router.get('/:id/messages', getMessages);
router.post('/:id/messages', postMessage);

// Project domain details
router.get('/:id/requirements', getRequirements);
router.post('/:id/requirements', createRequirement);
router.get('/:id/tech-stack', getTechStack);
router.get('/:id/comparisons', getComparisons);
router.get('/:id/architecture', getArchitecture);
router.get('/:id/roadmap', getRoadmap);
router.get('/:id/resources', getResources);
router.get('/:id/blueprint', getBlueprint);

export default router;
