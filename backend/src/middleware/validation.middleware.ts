import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      next(error);
    }
  };
};


export const authSchemas = {
//   register: z.object({
//     email: z.string().email('Invalid email format'),
//     password: z.string().min(6, 'Password must be at least 6 characters'),
//     name: z.string().min(2, 'Name must be at least 2 characters'),
//   }),
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
  forgotPassword: z.object({
    email: z.string().email('Invalid email format'),
  }),
  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    userId: z.string().min(1, 'User ID is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
};


