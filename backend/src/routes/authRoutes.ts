import { Router } from 'express';
import { register, login, logout, getMe, saveOnboarding } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.post('/onboarding', requireAuth, saveOnboarding);

export default router;
