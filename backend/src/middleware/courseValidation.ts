// middleware/courseValidation.ts
import { RequestHandler } from 'express';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from '../utils/i188n';

export const validateCourseMaterial: RequestHandler = (req, res, next) => {
  const { title, weekNumber } = req.body;

  if (!title || !weekNumber) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: getMessage('COURSE.ERRORS.MATERIAL_TITLE_WEEK_REQUIRED')
    });
  }

  // Fixed the syntax error here - removed extra closing parenthesis
  if (isNaN(parseInt(weekNumber))) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: getMessage('COURSE.ERRORS.INVALID_WEEK_NUMBER')
    });
  }

  next();
};

export const validateAssignment: RequestHandler = (req, res, next) => {
  const { title, description, instructions, dueDate } = req.body;

  if (!title || !description || !instructions || !dueDate) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: getMessage('COURSE.ERRORS.ASSIGNMENT_REQUIRED_FIELDS')
    });
  }

  if (new Date(dueDate) < new Date()) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: getMessage('COURSE.ERRORS.INVALID_DUE_DATE')
    });
  }

  next();
};

export const validateStudentAssignment: RequestHandler = (req, res, next) => {
  const { studentIds } = req.body;

  if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: getMessage('COURSE.ERRORS.STUDENT_IDS_REQUIRED')
    });
  }

  next();
};