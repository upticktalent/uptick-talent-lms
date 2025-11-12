import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/db';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from '../constants/i18n';
import { Track } from '@prisma/client';

const isValidUuid = (value?: string): boolean => {
  if (!value) return false;
  return /^[0-9a-fA-F-]{36}$/.test(value);
};

const ensureTrack = (track?: string): track is Track => {
  return !!track && Object.values(Track).includes(track as Track);
};

const sendBadRequest = (res: Response, message: string) =>
  responseObject({
    res,
    statusCode: HttpStatusCode.BAD_REQUEST,
    message,
  });

export const validateCreateCohort = (req: Request, res: Response, next: NextFunction) => {
  const { name, track, startDate, endDate } = req.body;

  if (!name || !ensureTrack(track) || !startDate || !endDate) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.COHORT_REQUIRED_FIELDS'));
  }

  next();
};

export const validateCreateStudent = (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, track } = req.body;

  if (!email || !firstName || !lastName || !ensureTrack(track)) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.STUDENT_REQUIRED_FIELDS'));
  }

  next();
};

export const validateCreateMentor = (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName } = req.body;

  if (!email || !firstName || !lastName) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.MENTOR_REQUIRED_FIELDS'));
  }

  next();
};

export const validateCreateCourse = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, track, cohortId } = req.body;

  if (!title || !description || !ensureTrack(track) || !cohortId) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.COURSE_REQUIRED_FIELDS'));
  }

  next();
};

export const validateEmailApplicants = (req: Request, res: Response, next: NextFunction) => {
  const { applicantIds, subject, message } = req.body;
  if (!Array.isArray(applicantIds) || applicantIds.length === 0 || !subject || !message) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.EMAIL_REQUIRED_FIELDS'));
  }
  next();
};

export const validateSendAssessment = (req: Request, res: Response, next: NextFunction) => {
  const { applicantIds, assessmentLink } = req.body;
  if (!Array.isArray(applicantIds) || applicantIds.length === 0 || !assessmentLink) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.ASSESSMENT_REQUIRED_FIELDS'));
  }
  next();
};

export const validateEvaluateAssessment = (req: Request, res: Response, next: NextFunction) => {
  const { applicantId, passed } = req.body;
  if (!applicantId || passed === undefined) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.EVALUATION_REQUIRED_FIELDS'));
  }
  next();
};

export const validateUpdateApplicantStatus = (req: Request, res: Response, next: NextFunction) => {
  const { applicantId, status } = req.body;
  if (!applicantId || !status) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.STATUS_UPDATE_REQUIRED_FIELDS'));
  }
  next();
};

export const validateCreateStudentFromApplicant = (req: Request, res: Response, next: NextFunction) => {
  const { applicantId } = req.body;
  if (!applicantId) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.APPLICANT_ID_REQUIRED'));
  }
  next();
};

export const validateBulkCreateStudents = (req: Request, res: Response, next: NextFunction) => {
  const { applicantIds } = req.body;

  if (!Array.isArray(applicantIds) || applicantIds.length === 0) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.APPLICANT_IDS_REQUIRED'));
  }

  next();
};

export const checkCohortExists = async (req: Request, res: Response, next: NextFunction) => {
  const cohortId = req.body.cohortId ?? req.body.cohort?.id;

  if (!cohortId || !isValidUuid(cohortId)) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.COHORT_REQUIRED_FIELDS'));
  }

  const cohort = await prisma.cohort.findUnique({ where: { id: cohortId } });

  if (!cohort) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.NOT_FOUND,
      message: 'Cohort not found',
    });
  }

  next();
};

export const checkMentorExists = async (req: Request, res: Response, next: NextFunction) => {
  const mentorId = req.body.mentorId;
  if (!mentorId) {
    return next();
  }

  if (!isValidUuid(mentorId)) {
    return sendBadRequest(res, getMessage('ADMIN.ERRORS.MENTOR_REQUIRED_FIELDS'));
  }

  const mentor = await prisma.mentorProfile.findUnique({ where: { id: mentorId } });

  if (!mentor) {
    return responseObject({
      res,
      statusCode: HttpStatusCode.NOT_FOUND,
      message: 'Mentor not found',
    });
  }

  next();
};

