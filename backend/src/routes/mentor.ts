import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getMentorDashboard,
  getMentorCourses,
  createMentorCourse,
  getMentorStudents,
  addMentorCourseMaterial,
  createMentorAssignment,
  gradeAssignment,
  getAssignmentSubmissions,
  updateMentorProfile,
  getCourseAnalytics
} from '../controllers/mentorController';
import { urls } from '../constants/urls';
import { Role } from '@prisma/client';

const router = express.Router();

// All routes require mentor authentication
// router.use(authenticate, authorize(Role.MENTOR));

// Dashboard
router.get(urls.mentor.dashboard().path, authenticate, authorize(Role.MENTOR), getMentorDashboard);

// Course management
router.get(urls.mentor.courses().path, authenticate, authorize(Role.MENTOR), getMentorCourses);
router.post(urls.mentor.createCourse().path, authenticate, authorize(Role.MENTOR), createMentorCourse);
router.post(urls.mentor.courseMaterials().path, authenticate, authorize(Role.MENTOR), addMentorCourseMaterial);
router.post(urls.mentor.createAssignment().path, authenticate, authorize(Role.MENTOR), createMentorAssignment);

// Student management
router.get(urls.mentor.students().path, authenticate, authorize(Role.MENTOR), getMentorStudents);

// Assignment grading
router.get(urls.mentor.assignmentSubmissions().path, authenticate, authorize(Role.MENTOR), getAssignmentSubmissions);
router.put(urls.mentor.gradeSubmission().path, authenticate, authorize(Role.MENTOR), gradeAssignment);

// Analytics
router.get(urls.mentor.courseAnalytics().path, authenticate, authorize(Role.MENTOR), getCourseAnalytics);

// Profile
router.put(urls.mentor.profile().path, authenticate, authorize(Role.MENTOR), updateMentorProfile);

export default router;