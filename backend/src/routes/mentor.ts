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
router.use(authenticate, authorize(Role.MENTOR));

// Dashboard
router.get(urls.mentor.dashboard().path, getMentorDashboard);

// Course management
router.get(urls.mentor.courses().path, getMentorCourses);
router.post(urls.mentor.createCourse().path, createMentorCourse);
router.post(urls.mentor.courseMaterials().path, addMentorCourseMaterial);
router.post(urls.mentor.createAssignment().path, createMentorAssignment);

// Student management
router.get(urls.mentor.students().path, getMentorStudents);

// Assignment grading
router.get(urls.mentor.assignmentSubmissions().path, getAssignmentSubmissions);
router.put(urls.mentor.gradeSubmission().path, gradeAssignment);

// Analytics
router.get(urls.mentor.courseAnalytics().path, getCourseAnalytics);

// Profile
router.put(urls.mentor.profile().path, updateMentorProfile);

export default router;