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
  updateApplicantStatus
} from '../controllers/adminController';
import { urls } from '../constants/urls';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize('ADMIN'));

// Cohort routes
router.post(urls.admin.createCohort().path, createCohort);
router.get(urls.admin.cohorts().path, getCohorts);

// User creation routes
router.post(urls.admin.createStudent().path, createStudentAccount);
router.post(urls.admin.createMentor().path, createMentorAccount);

// Course routes
router.post(urls.admin.createCourse().path, createCourse);
router.get(urls.admin.courses().path, getCourses);

// User management routes
router.get('/users/track', getUsersByTrack);

// Applicant management routes
router.get(urls.admin.applicants().path, getApplicants);
router.post(urls.admin.emailApplicants().path, emailApplicants);
router.post(urls.admin.sendAssessment().path, sendAssessment);
router.get(urls.admin.assessmentProgress().path, getAssessmentProgress);
router.post(urls.admin.evaluateAssessment().path, evaluateAssessment);
router.put(urls.admin.updateApplicantStatus().path, updateApplicantStatus);

// Student creation from applicants
router.post(urls.admin.createStudentFromApplicant().path, createStudentFromApplicant);
router.post(urls.admin.bulkCreateStudents().path, bulkCreateStudents);

// Dashboard
router.get(urls.admin.dashboard().path, getAdminDashboard);

export default router;