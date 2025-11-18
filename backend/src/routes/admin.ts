import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createCohort,
  getCohorts,
  createStudentAccount,
  createMentorAccount,
  createCourse,
  getCourses,
  getUsersByTrack,
  emailApplicants,
  getApplicants,
  sendAssessment,
  getAssessmentProgress,
  evaluateAssessment,
  createStudentFromApplicant,
  bulkCreateStudents,
  getAdminDashboard,
  updateApplicantStatus,
  evaluateInterview,
  scheduleInterview,
  assignStudentToCohort,
   addCourseMaterial,
  createAssignment,
  assignStudentsToCourse
} from '../controllers/adminController';
import { urls } from '../constants/urls';
import { Role } from '@prisma/client';
import {
  validateCreateCohort,
  validateCreateStudent,
  validateCreateMentor,
  validateCreateCourse,
  validateEmailApplicants,
  validateSendAssessment,
  validateEvaluateAssessment,
  validateUpdateApplicantStatus,
  validateCreateStudentFromApplicant,
  validateBulkCreateStudents,
  checkCohortExists,
  checkMentorExists
} from '../middleware/adminValidation';
import { validatePagination } from '../middleware/validation';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize(Role.ADMIN));

// Cohort routes with validation
router.post(urls.admin.createCohort().path, validateCreateCohort, createCohort);
router.get(urls.admin.cohorts().path, getCohorts);

// User creation routes with validation
router.post(urls.admin.createStudent().path, validateCreateStudent, createStudentAccount);
router.post(urls.admin.createMentor().path, validateCreateMentor, createMentorAccount);

// Course routes with validation
router.post(urls.admin.createCourse().path, validateCreateCourse,  createCourse);
router.get(urls.admin.courses().path, getCourses);
router.post(urls.admin.courseMaterials().path, addCourseMaterial);
router.post(urls.admin.courseAssignments().path, createAssignment);
router.post(urls.admin.assignStudentsToCourse().path, assignStudentsToCourse);
// User management routes
router.get(urls.user_management.getAll().path, getUsersByTrack);

// Applicant management routes with validation
router.get(urls.admin.applicants().path, validatePagination, getApplicants);
router.post(urls.admin.emailApplicants().path, validateEmailApplicants, emailApplicants);
router.post(urls.admin.sendAssessment().path, validateSendAssessment, sendAssessment);
router.get(urls.admin.assessmentProgress().path, validatePagination, getAssessmentProgress);
router.post(urls.admin.evaluateAssessment().path, validateEvaluateAssessment, evaluateAssessment);
router.put(urls.admin.updateApplicantStatus().path, validateUpdateApplicantStatus, updateApplicantStatus);
router.put(urls.admin.assignCohort().path, authenticate, authorize(Role.ADMIN), assignStudentToCohort)

// Student creation from applicants with validation
router.post(urls.admin.createStudentFromApplicant().path, validateCreateStudentFromApplicant, checkCohortExists, createStudentFromApplicant);
router.post(urls.admin.bulkCreateStudents().path, validateBulkCreateStudents, checkCohortExists, bulkCreateStudents);

// Dashboard
router.get(urls.admin.dashboard().path, getAdminDashboard);
router.post(urls.applicant.interview().path, authenticate, authorize(Role.ADMIN), evaluateInterview);
router.post(urls.applicant.schedule().path, authenticate, authorize(Role.ADMIN), scheduleInterview);

export default router;