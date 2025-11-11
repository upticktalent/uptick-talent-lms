import { Response } from 'express';
import { PrismaClient, Role, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import { PASSWORD_CONSTANTS } from '../constants/password';
import { Logger } from '../constants/logger';
import { EnvironmentConfig } from '../constants/environment';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from '../constants/i18n';

const prisma = new PrismaClient();

const generateRandomPassword = (length: number = PASSWORD_CONSTANTS.DEFAULT_LENGTH): string => {
  let password = '';
  for (let i = 0; i < length; i++) {
    password += PASSWORD_CONSTANTS.CHARSET.charAt(
      Math.floor(Math.random() * PASSWORD_CONSTANTS.CHARSET.length)
    );
  }
  return password;
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, firstName, lastName, role = Role.STUDENT, track } = req.body;

    // Split guards with clear individual messages using i18n
    if (!email) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.EMAIL_REQUIRED')
      });
    }

    if (!firstName) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.FIRST_NAME_REQUIRED')
      });
    }

    if (!lastName) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.LAST_NAME_REQUIRED')
      });
    }

    if (![Role.STUDENT, Role.MENTOR].includes(role)) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.ROLE_INVALID')
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.EMAIL_EXISTS')
      });
    }

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, PASSWORD_CONSTANTS.SALT_ROUNDS);

    const baseUserData: Prisma.UserCreateInput = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    };

    // Create the complete user data with conditional profile
    let userData: Prisma.UserCreateInput;

    if (role === Role.STUDENT) {
      userData = {
        ...baseUserData,
        studentProfile: {
          create: {
            email,
            firstName,
            track: track || 'default-track',
            lastName
          }
        }
      };
    } else if (role === Role.MENTOR) {
      userData = {
        ...baseUserData,
        mentorProfile: {
          create: {
            email,
            firstName,
            track: track || 'default-track',
            lastName
          }
        }
      };
    } else {
      userData = baseUserData;
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        studentProfile: role === Role.STUDENT,
        mentorProfile: role === Role.MENTOR
      }
    });

    responseObject({
      statusCode: HttpStatusCode.CREATED,
      res,
      message: getMessage('USERS.SUCCESS.CREATED'),
      payload: {
        user,
        temporaryPassword: EnvironmentConfig.IS_DEVELOPMENT ? randomPassword : undefined
      }
    });
    
  } catch (error) {
    Logger.error('Create user error:', error);
    responseObject({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      res,
      message: getMessage('USERS.ERRORS.INTERNAL_CREATION')
    });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: Prisma.UserWhereInput = {};
    if (role && [Role.ADMIN, Role.STUDENT, Role.MENTOR].includes(role as Role)) {
      where.role = role as Role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          adminProfile: true,
          mentorProfile: true,
          studentProfile: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take
      }),
      prisma.user.count({ where })
    ]);

    responseObject({
      statusCode: HttpStatusCode.OK,
      res,
      message: getMessage('USERS.SUCCESS.LIST_RETRIEVED'),
      payload: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    Logger.error('Get all users error:', error);
    responseObject({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      res,
      message: getMessage('USERS.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        adminProfile: true,
        mentorProfile: true,
        studentProfile: true
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
      statusCode: HttpStatusCode.OK,
      res,
      message: getMessage('USERS.SUCCESS.RETRIEVED'),
      payload: {
        user
      }
    });
  } catch (error) {
    Logger.error('Get user by id error:', error);
    responseObject({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      res,
      message: getMessage('USERS.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('USERS.ERRORS.NOT_FOUND')
      });
    }

    const updateData: Prisma.UserUpdateInput = {
      updatedAt: new Date()
    };

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role && [Role.ADMIN, Role.STUDENT, Role.MENTOR].includes(role)) {
      updateData.role = role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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
      message: getMessage('USERS.SUCCESS.UPDATED'),
      payload: {
        user
      }
    });
    
  } catch (error) {
    Logger.error('Update user error:', error);
    responseObject({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      res,
      message: getMessage('USERS.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const resetUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('USERS.ERRORS.NOT_FOUND')
      });
    }

    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_CONSTANTS.SALT_ROUNDS);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    responseObject({
      statusCode: HttpStatusCode.OK,
      res,
      message: getMessage('USERS.SUCCESS.PASSWORD_RESET'),
      payload: {
        newPassword: EnvironmentConfig.IS_DEVELOPMENT ? newPassword : undefined
      }
    });
   
  } catch (error) {
    Logger.error('Reset user password error:', error);
    responseObject({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      res,
      message: getMessage('USERS.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('USERS.ERRORS.NOT_FOUND')
      });
    }

    if (user.id === req.user.id) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.SELF_DELETE')
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    responseObject({
      statusCode: HttpStatusCode.OK,
      res,
      message: getMessage('USERS.SUCCESS.DELETED')
    });
  } catch (error) {
    Logger.error('Delete user error:', error);
    responseObject({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      res,
      message: getMessage('USERS.ERRORS.INTERNAL_SERVER')
    });
  }
};