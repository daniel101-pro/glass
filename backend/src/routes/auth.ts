import { Router } from 'express';
import type { Request, Response } from 'express';
import { userStore } from '../stores/userStore.js';
import { AuthUtils } from '../utils/auth.js';
import { signupValidation, loginValidation } from '../validation/auth.js';
import { validateRequest, authenticateToken } from '../middleware/auth.js';
import type { CreateUserData, LoginData, AuthResponse } from '../types/user.js';

const router = Router();

/**
 * POST /auth/signup
 * Create a new user account
 */
router.post('/signup', signupValidation, validateRequest, async (req: Request, res: Response) => {
  try {
    const { email, fullName, password }: CreateUserData = req.body;

    // Create user
    const user = await userStore.createUser({
      email,
      fullName,
      password,
    });

    // Generate tokens
    const tokens = AuthUtils.generateTokens(user.id);

    // Prepare response
    const response: AuthResponse = {
      user: AuthUtils.toUserResponse(user),
      tokens,
    };

    res.status(201).json({
      message: 'Account created successfully',
      data: response,
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error && error.message === 'Email already exists') {
      return res.status(409).json({
        error: 'Email already exists',
      });
    }

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * POST /auth/login
 * Authenticate user and return tokens
 */
router.post('/login', loginValidation, validateRequest, async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginData = req.body;

    // Find user by email
    const user = await userStore.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Check password
    const isValidPassword = await AuthUtils.comparePassword(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate tokens
    const tokens = AuthUtils.generateTokens(user.id);

    // Prepare response
    const response: AuthResponse = {
      user: AuthUtils.toUserResponse(user),
      tokens,
    };

    res.json({
      message: 'Login successful',
      data: response,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * GET /auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    // Get full user data
    const user = await userStore.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      data: AuthUtils.toUserResponse(user),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * POST /auth/refresh
 * Refresh access token (placeholder for now)
 */
router.post('/refresh', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    // Generate new tokens
    const tokens = AuthUtils.generateTokens(req.user.id);

    res.json({
      message: 'Token refreshed successfully',
      data: { tokens },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export { router as authRouter };

