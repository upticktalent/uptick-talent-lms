

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';
import { SecurityConstants } from '../constants/security';
import { HttpStatusCode } from '@config';

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
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Access denied. No authorization header provided.'
      });
      return;
    }

    // Check for Bearer token format
    if (!authHeader.startsWith(SecurityConstants.AUTH.TOKEN_TYPE)) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: `Invalid token format. Expected '${SecurityConstants.AUTH.TOKEN_TYPE}' prefix.`
      });
      return;
    }

    const token = authHeader.replace(`${SecurityConstants.AUTH.TOKEN_TYPE} `, '');
    
    if (!token) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, SecurityConstants.JWT.SECRET) as any;
    
    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        
        // Add other necessary fields
      }
    });

    if (!user) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'User not found. Token invalid.'
      });
      return;
    }

  

    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    let message = 'Invalid token';
    
    if (error instanceof jwt.TokenExpiredError) {
      message = 'Token has expired';
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = 'Malformed token';
    }

    res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      message
    });
    return;
  }
};

export const authorize = (allowedRoles: Role | Role[]): RequestHandler => {
  return (req, res, next) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions to access this resource'
      });
      return;
    }
    next();
  };
};


// export function generateToken(userId: string): string {
//   const payload = { id: userId };
//   const secret = process.env.JWT_SECRET;
  
//   if (!secret) {
//     throw new Error('JWT_SECRET is not defined in environment variables');
//   }

//   return jwt.sign(payload, secret, { 
//     expiresIn: '24h'
//   });
// }


export function generateToken(userId: string): string {
  try {
    console.log('🔑 Generating token for user:', userId);
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const payload = { 
      id: userId,
      iat: Math.floor(Date.now() / 1000), // issued at
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: '24h'
    });

    console.log('✅ Token generated successfully');
    return token;
  } catch (error) {
    console.error('❌ Token generation failed:', error);
    throw error;
  }
}

export const verifyToken = (token: string): any => {
  return jwt.verify(token, SecurityConstants.JWT.SECRET, {
    issuer: SecurityConstants.JWT.ISSUER,
    audience: SecurityConstants.JWT.AUDIENCE,
  });
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

// Optional: Token refresh functionality
export const refreshToken = async (oldToken: string): Promise<string | null> => {
  try {
    const decoded = verifyToken(oldToken) as any;
    const newToken = await generateToken(decoded.id);
    return newToken;
  } catch (error) {
    return null;
  }
};