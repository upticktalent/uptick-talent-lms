import { Request, Response, NextFunction } from 'express';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from '../constants/i18n';
import { Role } from '@prisma/client';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, role } = req.body;

  const errors: string[] = [];

  if (!email) errors.push(getMessage('USERS.ERRORS.EMAIL_REQUIRED'));
  if (!firstName) errors.push(getMessage('USERS.ERRORS.FIRST_NAME_REQUIRED'));
  if (!lastName) errors.push(getMessage('USERS.ERRORS.LAST_NAME_REQUIRED'));
  
  if (role && ![Role.STUDENT, Role.MENTOR].includes(role)) {
    errors.push(getMessage('USERS.ERRORS.ROLE_INVALID'));
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push(getMessage('USERS.ERRORS.EMAIL_INVALID'));
    }
  }

  if (errors.length > 0) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: errors.join(', ')
    });
  }

  next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, role, email } = req.body;
  const errors: string[] = [];

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push(getMessage('USERS.ERRORS.EMAIL_INVALID'));
    }
  }

  if (role && ![Role.ADMIN, Role.STUDENT, Role.MENTOR].includes(role)) {
    errors.push(getMessage('USERS.ERRORS.ROLE_INVALID'));
  }

  if (errors.length > 0) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: errors.join(', ')
    });
  }

  next();
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: getMessage('USERS.ERRORS.PAGE_INVALID')
    });
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: getMessage('USERS.ERRORS.LIMIT_INVALID')
    });
  }

  next();
};