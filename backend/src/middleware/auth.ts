import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthUtils } from '../utils/auth.js';
import { userStore } from '../stores/userStore.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        fullName: string;
      };
    }
  }
}

/**
 * Middleware to validate request inputs
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Access token required',
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
      });
    }

    // Verify the token
    const decoded = AuthUtils.verifyToken(token);
    
    // Get user from store
    const user = await userStore.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};

/**
 * Optional authentication - adds user to request if valid token provided
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const decoded = AuthUtils.verifyToken(token);
        const user = await userStore.findById(decoded.userId);
        
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          };
        }
      }
    }
    
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

