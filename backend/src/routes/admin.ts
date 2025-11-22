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
  getAcceptedAndRejectedApplicantsData,
  getSubmittedAssessments,
   addCourseMaterial,
  createAssignment,
  assignStudentsToCourse,
  addSingleCourseMaterial
} from '../controllers/adminController';
import { saveTrackAssessment, getTrackAssessment } from '@controllers/assessmentContoller';
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
  checkMentorExists,
  validateMaterialData, validateBulkMaterials
} from '../middleware/adminValidation';
import { validatePagination } from '../middleware/validation';

const router = express.Router();

// All routes require admin authentication
// router.use(authenticate, authorize(Role.ADMIN));

// get Applicants data (accepted and failed applicants)


// Cohort routes with validation
router.post(urls.admin.createCohort().path, authenticate, authorize(Role.ADMIN), validateCreateCohort, createCohort);
router.get(urls.admin.cohorts().path, authenticate, authorize(Role.ADMIN), getCohorts);

// User creation routes with validation
router.post(urls.admin.createStudent().path,  authenticate, authorize(Role.ADMIN), validateCreateStudent, createStudentAccount);
router.post(urls.admin.createMentor().path,  authenticate, authorize(Role.ADMIN), validateCreateMentor, createMentorAccount);

// Course routes with validation
router.post(urls.admin.createCourse().path,   authenticate, authorize(Role.ADMIN), validateCreateCourse,  createCourse);
router.get(urls.admin.courses().path,   authenticate, authorize(Role.ADMIN), getCourses);
router.post(urls.admin.courseMaterials().path, authenticate, authorize(Role.ADMIN), validateBulkMaterials, addCourseMaterial);
router.post(urls.admin.courseAssignments().path, authenticate, authorize(Role.ADMIN),createAssignment);
router.post(urls.admin.assignStudentsToCourse().path, authenticate, authorize(Role.ADMIN), assignStudentsToCourse);
router.post(urls.admin.courseMaterials().path, authenticate, authorize(Role.ADMIN), validateMaterialData, addSingleCourseMaterial);
// User management routes
router.get(urls.user_management.getAll().path,authenticate, authorize(Role.ADMIN), getUsersByTrack);

// Applicant management routes with validation
router.get(urls.admin.applicants().path,   authenticate, authorize(Role.ADMIN), validatePagination, getApplicants);
router.post(urls.admin.emailApplicants().path,   authenticate, authorize(Role.ADMIN), validateEmailApplicants, emailApplicants);
router.post(urls.admin.sendAssessment().path,   authenticate, authorize(Role.ADMIN), validateSendAssessment, sendAssessment);
router.get(urls.admin.getAssessment().path, authenticate, authorize(Role.ADMIN), getSubmittedAssessments);
router.get(urls.admin.assessmentProgress().path,   authenticate, authorize(Role.ADMIN),validatePagination, getAssessmentProgress);
router.post(urls.admin.evaluateAssessment().path,   authenticate, authorize(Role.ADMIN), validateEvaluateAssessment, evaluateAssessment);
router.put(urls.admin.updateApplicantStatus().path,   authenticate, authorize(Role.ADMIN), validateUpdateApplicantStatus, updateApplicantStatus);
router.put(urls.admin.assignCohort().path, authenticate, authorize(Role.ADMIN), assignStudentToCohort);
router.get(urls.admin.applicantsData().path, authenticate, authorize(Role.ADMIN), getAcceptedAndRejectedApplicantsData);
router.post(urls.admin.saveTrackAssessment().path, authenticate, authorize(Role.ADMIN), saveTrackAssessment);
router.get(urls.admin.getTrackAssessment().path, authenticate, authorize(Role.ADMIN), getTrackAssessment);

// Student creation from applicants with validation
router.post(urls.admin.createStudentFromApplicant().path,  authenticate, authorize(Role.ADMIN), validateCreateStudentFromApplicant, checkCohortExists, createStudentFromApplicant);
router.post(urls.admin.bulkCreateStudents().path,   authenticate, authorize(Role.ADMIN), validateBulkCreateStudents, checkCohortExists, bulkCreateStudents);

// Dashboard
router.get(urls.admin.dashboard().path,  authenticate, authorize(Role.ADMIN), getAdminDashboard);
router.post(urls.applicant.interview().path, authenticate, authorize(Role.ADMIN), evaluateInterview);
router.post(urls.applicant.schedule().path, authenticate, authorize(Role.ADMIN), scheduleInterview);

export default router;