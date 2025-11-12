// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export interface AuthRequest extends Request {
//   user?: any;
// }

// // Fixed generateToken function
// export const generateToken = (userId: string): string => {
//   const jwtSecret = process.env.JWT_SECRET;
  
//   if (!jwtSecret) {
//     throw new Error('JWT_SECRET is not defined in environment variables');
//   }

//   const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

//   return jwt.sign(
//     { userId }, 
//     jwtSecret, 
//     { expiresIn } as jwt.SignOptions
//   );
// };

// export const authenticate = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'No token provided, access denied'
//       });
//     }

//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//       return res.status(500).json({
//         success: false,
//         message: 'Server configuration error'
//       });
//     }

//     const decoded = jwt.verify(token, jwtSecret) as any;
    
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         role: true,
//         // emailVerified: true
//       }
//     });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Token is invalid, user not found'
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     return res.status(401).json({
//       success: false,
//       message: 'Token is not valid'
//     });
//   }
// };

// export const authorize = (...roles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: 'You do not have permission to perform this action'
//       });
//     }

//     next();
//   };
// };


import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.'
      });
      return;
    }

    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
    return;
  }
};

export const authorize = (allowedRoles: Role | Role[]): RequestHandler => {
  return (req, res, next) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const authReq = req as AuthRequest;
    
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions to access this resource'
      });
      return;
    }
    next();
  };
};

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );
};