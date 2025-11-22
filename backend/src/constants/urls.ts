
import { routeCreator } from "../utils";

export const urls = {
  // Health routes
  health: {
    entry: () => routeCreator("health"),
    root: () => "/",
    detailed: () => "/detailed",
    liveness: () => "/liveness",
    readiness: () => "/readiness",
  },
  
  user_management: {
    getAll: () => routeCreator('all')
  },
  
  // Feature routes
  features: {
    getByFlag: () => routeCreator("flags"),
    getAll: () => routeCreator("all"),
  },
  
  // Authentication routes
  auth: {
    login: () => routeCreator("auth/login"),
    forgotPassword: () => routeCreator("auth/forgot-password"),
    resetPassword: () => routeCreator("auth/reset-password"),
    validateResetToken: () => routeCreator("auth/validate-reset-token"),
    me: () => routeCreator("auth/me"),
    profile: () => routeCreator("auth/profile"),
    changePassword: () => routeCreator("auth/change-password"),
  },
  
  // User management routes
  users: {
    base: () => routeCreator("users"),
    create: () => routeCreator("users"),
    getAll: () => routeCreator("users"),
    getById: (id?: string) => routeCreator(`users/${id || ':id'}`),
    update: (id?: string) => routeCreator(`users/${id || ':id'}`),
    delete: (id?: string) => routeCreator(`users/${id || ':id'}`),
    resetPassword: (id?: string) => routeCreator(`users/${id || ':id'}/reset-password`),
    byTrack: () => routeCreator("users/track"),
  },
  
  // Admin routes
  admin: {
    base: () => routeCreator("admin"),
    cohorts: () => routeCreator("admin/cohorts"),
    createCohort: () => routeCreator("admin/cohorts"),
    createStudent: () => routeCreator("admin/students"),
    createMentor: () => routeCreator("admin/mentors"),
    courses: () => routeCreator("admin/courses"),
    createCourse: () => routeCreator("admin/courses"),
    courseMaterials: (courseId?: string) => routeCreator(`admin/courses/${courseId || ':courseId'}/materials`),
    courseAssignments: (courseId?: string) => routeCreator(`admin/courses/${courseId || ':courseId'}/assignments`),
    assignStudentsToCourse: (courseId?: string) => routeCreator(`admin/courses/${courseId || ':courseId'}/assign-students`),
    applicants: () => routeCreator("admin/applicants"),
    emailApplicants: () => routeCreator("admin/applicants/email"),
    sendAssessment: () => routeCreator("admin/applicants/send-assessment"),
    assessmentProgress: () => routeCreator("admin/applicants/assessment-progress"),
    evaluateAssessment: () => routeCreator("admin/applicants/evaluate-assessment"),
    updateApplicantStatus: () => routeCreator("admin/applicants/status"),
    createStudentFromApplicant: () => routeCreator("admin/students/create-from-applicant"),
    bulkCreateStudents: () => routeCreator("admin/students/bulk-create"),
    dashboard: () => routeCreator("admin/dashboard"),
    assignCohort: () => routeCreator("admin/students/assign-cohort"),
    applicantsData: () => routeCreator("admin/applicants/applicantsData")
  },
  
  // Student routes
  student: {
    base: () => routeCreator("student"),
    dashboard: () => routeCreator("student/dashboard"),
    courses: (courseId?: string) => routeCreator(`student/courses/${courseId || ':courseId'}`),
    courseMaterials: (courseId?: string) => routeCreator(`student/courses/${courseId || ':courseId'}/materials`),
    assignments: () => routeCreator("student/assignments"),
    submitAssignment: (assignmentId?: string) => routeCreator(`student/assignments/${assignmentId || ':assignmentId'}/submit`)
  },
   // Mentor routes
  mentor: {
    base: () => routeCreator("mentor"),
    dashboard: () => routeCreator("mentor/dashboard"),
    courses: () => routeCreator("mentor/courses"),
    createCourse: () => routeCreator("mentor/courses"),
    students: () => routeCreator("mentor/students"),
    courseMaterials: (courseId?: string) => routeCreator(`mentor/courses/${courseId || ':courseId'}/materials`),
    createAssignment: (courseId?: string) => routeCreator(`mentor/courses/${courseId || ':courseId'}/assignments`),
    assignmentSubmissions: (assignmentId?: string) => routeCreator(`mentor/assignments/${assignmentId || ':assignmentId'}/submissions`),
    gradeSubmission: (submissionId?: string) => routeCreator(`mentor/submissions/${submissionId || ':submissionId'}/grade`),
    courseAnalytics: (courseId?: string) => routeCreator(`mentor/courses/${courseId || ':courseId'}/analytics`),
    profile: () => routeCreator("mentor/profile"),
  },
  

  
  applicant: {
    interview: () => routeCreator('applicants/interview/evaluate'),
    schedule: () => routeCreator('applicants/interview/schedule')
  }
};

// Direct string constants (alternative approach)
export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE_RESET_TOKEN: '/auth/validate-reset-token',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  USERS: {
    BASE: '/users',
    BY_ID: '/users/:id',
    RESET_PASSWORD: '/users/:id/reset-password',
    BY_TRACK: '/users/track',
  },
  ADMIN: {
    COHORTS: '/admin/cohorts',
    STUDENTS: '/admin/students',
    MENTORS: '/admin/mentors',
    COURSES: '/admin/courses',
    COURSE_MATERIALS: '/admin/courses/:courseId/materials',
    COURSE_ASSIGNMENTS: '/admin/courses/:courseId/assignments',
    ASSIGN_STUDENTS_TO_COURSE: '/admin/courses/:courseId/assign-students',
    APPLICANTS: '/admin/applicants',
    EMAIL_APPLICANTS: '/admin/applicants/email',
    SEND_ASSESSMENT: '/admin/applicants/send-assessment',
    ASSESSMENT_PROGRESS: '/admin/applicants/assessment-progress',
    EVALUATE_ASSESSMENT: '/admin/applicants/evaluate-assessment',
    UPDATE_APPLICANT_STATUS: '/admin/applicants/status',
    CREATE_STUDENT_FROM_APPLICANT: '/admin/students/create-from-applicant',
    BULK_CREATE_STUDENTS: '/admin/students/bulk-create',
    ASSIGN_COHORT: '/admin/students/assign-cohort',
    DASHBOARD: '/admin/dashboard',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    COURSES: '/student/courses/:courseId',
    COURSE_MATERIALS: '/student/courses/:courseId/materials',
    ASSIGNMENTS: '/student/assignments',
    SUBMIT_ASSIGNMENT: '/student/assignments/:assignmentId/submit'
  },
 
  APPLICANT: {
    INTERVIEW: '/applicants/interview/evaluate',
    SCHEDULE: '/applicants/interview/schedule'
  },
 MENTOR: {
    DASHBOARD: '/mentor/dashboard',
    COURSES: '/mentor/courses',
    CREATE_COURSE: '/mentor/courses',
    STUDENTS: '/mentor/students',
    COURSE_MATERIALS: '/mentor/courses/:courseId/materials',
    CREATE_ASSIGNMENT: '/mentor/courses/:courseId/assignments',
    ASSIGNMENT_SUBMISSIONS: '/mentor/assignments/:assignmentId/submissions',
    GRADE_SUBMISSION: '/mentor/submissions/:submissionId/grade',
    COURSE_ANALYTICS: '/mentor/courses/:courseId/analytics',
    PROFILE: '/mentor/profile',
  },
  HEALTH: '/health',
  USER_MANAGEMENT: '/users/track'
} as const;

// Helper function to get full API URLs
export const getApiUrl = (path: string): string => {
  const basePath = process.env.API_BASE_PATH || '/api/v1';
  return `${basePath}${path}`;
};