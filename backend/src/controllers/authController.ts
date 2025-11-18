import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, generateToken } from '../middleware/auth';
import { sendPasswordResetEmail, sendPasswordChangedEmail } from '../utils/EmailService';
import { Logger } from '../constants/logger';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from '../utils/i188n';
import { EnvironmentConfig } from '../constants/environment';

const prisma = new PrismaClient();

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     console.log('🔐 Login Attempt:', req.body);
    
//     if (!email || !password) {
//       return responseObject({
//         res,
//         statusCode: HttpStatusCode.BAD_REQUEST,
//         message: getMessage('AUTH.ERRORS.EMAIL_PASSWORD_REQUIRED')
//       });
//     }

//     const user = await prisma.user.findUnique({
//       where: { email }
//     });

//     if (!user) {
//       return responseObject({
//         res,
//         statusCode: HttpStatusCode.UNAUTHORIZED,
//         message: getMessage('AUTH.ERRORS.INVALID_CREDENTIALS')
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return responseObject({
//         res,
//         statusCode: HttpStatusCode.UNAUTHORIZED,
//         message: getMessage('AUTH.ERRORS.INVALID_CREDENTIALS')
//       });
//     }

//     const token = generateToken(user.id);

//     const userWithoutPassword = {
//       id: user.id,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       role: user.role,
//       createdAt: user.createdAt
//     };

//     responseObject({
//       res,
//       statusCode: HttpStatusCode.OK,
//       message: getMessage('AUTH.SUCCESS.LOGIN'),
//       payload: {
//         user: userWithoutPassword,
//         token
//       },
//       status: true
//     });
   
//   } catch (error) {
//     Logger.error('Login error:', error);
//     responseObject({
//       res,
//       statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
//       message: getMessage('AUTH.ERRORS.INTERNAL_LOGIN')
//     });
//   }
// };



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 🔍 COMPREHENSIVE DEBUGGING
    console.log('🔐 ========== LOGIN ATTEMPT ==========');
    console.log('📦 Full Request Body:', JSON.stringify(req.body, null, 2));
    console.log('📧 Email from req.body:', email);
    console.log('🔑 Password from req.body:', password ? '***' : 'MISSING');
    console.log('📨 Content-Type header:', req.headers['content-type']);
    console.log('🔍 Request method:', req.method);
    console.log('🔍 Request URL:', req.url);
    console.log('🔍 Raw body received:', req.body);
    console.log('🔍 Body type:', typeof req.body);
    console.log('=====================================');

    // Check if email and password are present
    if (!email || !password) {
      console.log('❌ VALIDATION FAILED:');
      console.log('   Email present:', !!email);
      console.log('   Password present:', !!password);
      console.log('   Email value:', email);
      console.log('   Password value:', password);
      
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.EMAIL_PASSWORD_REQUIRED')
      });
    }

    console.log('✅ Email and password received, searching for user...');

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('👤 Database lookup result:', user ? 'User found' : 'User not found');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return responseObject({
        res,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: getMessage('AUTH.ERRORS.INVALID_CREDENTIALS')
      });
    }

    console.log('🔑 User found, comparing passwords...');
    console.log('   Stored password hash:', user.password ? '***' : 'MISSING');

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('✅ Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Password invalid for user:', email);
      return responseObject({
        res,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: getMessage('AUTH.ERRORS.INVALID_CREDENTIALS')
      });
    }

    console.log('🎉 Login successful, generating token...');

    // Generate JWT token
    const token = generateToken(user.id);

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt
    };

    console.log('✅ Login completed successfully for:', email);
    
    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('AUTH.SUCCESS.LOGIN'),
      payload: {
        user: userWithoutPassword,
        token
      },
      status: true
    });
   
  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    Logger.error('Login error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('AUTH.ERRORS.INTERNAL_LOGIN')
    });
  }
};





export const getMe: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('USERS.ERRORS.NOT_FOUND')
      });
    }
      
    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('AUTH.SUCCESS.PROFILE_RETRIEVED'),
      payload: {
        user
      },
      status: true
    });
   
  } catch (error) {
    Logger.error('Get me error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('AUTH.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const userId = (req as AuthRequest).user.id;

    if (!firstName || !lastName) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.FIRST_LAST_NAME_REQUIRED')
      });
    }

    if (firstName.trim() === '' || lastName.trim() === '') {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.NAME_CANNOT_BE_EMPTY')
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('AUTH.SUCCESS.PROFILE_UPDATED'),
      payload: {
        user  
      },
      status: true
    });
   
  } catch (error) {
    Logger.error('Update profile error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('AUTH.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const changePassword: RequestHandler = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as AuthRequest).user.id;

    if (!currentPassword || !newPassword) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.CURRENT_NEW_PASSWORD_REQUIRED')
      });
    }

    if (newPassword.length < 6) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.PASSWORD_MIN_LENGTH')
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('USERS.ERRORS.NOT_FOUND')
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: getMessage('AUTH.ERRORS.INCORRECT_CURRENT_PASSWORD')
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });
 
    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('AUTH.SUCCESS.PASSWORD_CHANGED'),
      status: true
    });
   
  } catch (error) {
    Logger.error('Change password error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('AUTH.ERRORS.INTERNAL_PASSWORD_CHANGE')
    });
  }
};



export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    console.log('🔐 Forgot Password Request:', { email });

    if (!email) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.EMAIL_REQUIRED')
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('👤 User found:', !!user);

    // Always return success even if user doesn't exist (for security)
    if (!user) {
      console.log('📧 User not found, but returning success for security');
      return responseObject({
        res,
        statusCode: HttpStatusCode.OK,
        message: getMessage('AUTH.SUCCESS.RESET_EMAIL_SENT')
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    console.log('🔑 Generated reset token:', resetToken);

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    });

    console.log('🗑️ Deleted existing reset tokens');

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expiresAt
      }
    });

    console.log('💾 Saved new reset token to database');

    // Send reset email
    if (!EnvironmentConfig.IS_TEST) {
      console.log('📤 Attempting to send reset email via Resend');
      await sendPasswordResetEmail(email, resetToken);
      console.log('✅ Email process completed');
    } else {
      console.log('🧪 Test environment - skipping email send');
    }

    // For development, you can optionally return the token
    const responsePayload = process.env.NODE_ENV === 'development' ? {
      resetToken: resetToken,
      email: email,
      // note: 'This is only returned in development mode for testing'
    } : undefined;

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('AUTH.SUCCESS.RESET_EMAIL_SENT'),
      payload: responsePayload
    });
   
  } catch (error: any) {
    console.error('❌ Forgot password error details:', error);
    Logger.error('Forgot password error:', error);
    
    // Check if it's an email error and handle gracefully
    if (error.message.includes('email') || error.message.includes('Email')) {
      console.log('⚠️ Email error, but returning success to user');
      return responseObject({
        res,
        statusCode: HttpStatusCode.OK,
        message: getMessage('AUTH.SUCCESS.RESET_EMAIL_SENT')
      });
    }
    
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('AUTH.ERRORS.INTERNAL_RESET_REQUEST')
    });
  }
};




export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.TOKEN_NEW_PASSWORD_REQUIRED')
      });
    }

    if (newPassword.length < 6) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.PASSWORD_MIN_LENGTH')
      });
    }

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    // Check if token exists and is not expired
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.INVALID_EXPIRED_TOKEN')
      });
    }

    // Find user by email from the token
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    });

    if (!user) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('USERS.ERRORS.NOT_FOUND')
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    // Delete used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    });

    // Send password changed notification
    if (!EnvironmentConfig.IS_TEST) {
      await sendPasswordChangedEmail(user.email);
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('AUTH.SUCCESS.PASSWORD_RESET')
    });
    
  } catch (error) {
    Logger.error('Reset password error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('AUTH.ERRORS.INTERNAL_RESET')
    });
  }
};

export const validateResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.TOKEN_REQUIRED')
      });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    const isValid = resetToken && resetToken.expiresAt > new Date();

    if (!isValid) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('AUTH.ERRORS.INVALID_EXPIRED_TOKEN')
      });
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('AUTH.SUCCESS.TOKEN_VALID'),
      payload: {
        email: resetToken.email,
        isValid: true
      },
      status: true
    });
   
  } catch (error) {
    Logger.error('Validate reset token error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('AUTH.ERRORS.INTERNAL_TOKEN_VALIDATION')
    });
  }
};