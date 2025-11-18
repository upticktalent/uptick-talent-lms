// routes/student.routes.ts
import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { 
  getStudentDashboard,
  getStudentCourse,
  submitAssignment,
  getStudentAssignments,
  getCourseMaterials
} from '../controllers/studentController';
import { urls } from '../constants/urls';
import { Role } from '@prisma/client';

const router = express.Router();

// All routes require student authentication
router.use(authenticate, authorize([Role.STUDENT]));

// Student dashboard
router.get(urls.student.dashboard().path, getStudentDashboard);

// Course routes
router.get(urls.student.courses().path, getStudentCourse);
router.get(urls.student.courseMaterials().path, getCourseMaterials);

// Assignment routes
router.get(urls.student.assignments().path, getStudentAssignments);
router.post(urls.student.submitAssignment().path, submitAssignment);

export default router;