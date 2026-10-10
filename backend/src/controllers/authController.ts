import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { store } from '../services/store';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email address, and password are required.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please verify your confirmation.'
      });
    }

    const existingUser = await store.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await store.createUser(name, email, passwordHash, username);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to register account.'
    });
  }
};

export const saveOnboarding = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to save onboarding preferences.'
      });
    }

    const onboardingData = req.body;
    const updatedUser = await store.updateUserOnboarding(req.user.id, onboardingData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.'
      });
    }

    return res.json({
      success: true,
      data: updatedUser,
      message: 'Onboarding profile saved successfully.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to persist onboarding preferences.'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const userRecord = await store.findUserByEmail(email);
    if (!userRecord) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: userRecord.id, email: userRecord.email, role: userRecord.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const { passwordHash: _, ...safeUser } = userRecord;

    return res.json({
      success: true,
      data: {
        user: safeUser,
        token
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to authenticate.'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const user = await store.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch current user profile.'
    });
  }
};
