import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { Role } from '@prisma/client';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from '../utils/i188n';

// Middleware to check if user has required role
export const requireRole = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user.role as Role)) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.FORBIDDEN,
        message: getMessage('AUTH.ERRORS.INSUFFICIENT_PERMISSIONS')
      });
    }
    next();
  };
};

// Specific role checkers
export const requireAdmin = requireRole([Role.ADMIN]);
export const requireAdminOrMentor = requireRole([Role.ADMIN, Role.MENTOR]);
export const requireAnyAuth = requireRole([Role.ADMIN, Role.MENTOR, Role.STUDENT]);

// Middleware to check if user is accessing their own data or is admin
export const canManageUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const requestedUserId = req.params.id;
  
  if (req.user.role === Role.ADMIN || req.user.id === requestedUserId) {
    return next();
  }

  return responseObject({
    res,
    statusCode: HttpStatusCode.FORBIDDEN,
    message: getMessage('USERS.ERRORS.CANNOT_MANAGE_OTHER_USERS')
  });
};