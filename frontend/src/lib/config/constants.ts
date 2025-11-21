export const env = {
  AUTH_TOKEN: '______Up@TickLMS____TOKEN___',
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  API_V1: '/api/v1/',
};

export const createRoute = (endpoint: string) => {
  return `${env.API_V1}${endpoint}`;
};

export const urls = {
  LOGIN: createRoute('auth/login'),
  APPLY: createRoute('applicants/createApplicant'),
  
  // Admin
  GET_APPLICANTS: createRoute('admin/applicants'),
  SEND_ASSESSMENT: createRoute('admin/applicants/send-assessment'),
  EVALUATE_ASSESSMENT: createRoute('admin/applicants/evaluate-assessment'),
  SCHEDULE_INTERVIEW: createRoute('applicants/interview/schedule'),
  EVALUATE_INTERVIEW: createRoute('applicants/interview/evaluate'),
  ADMIN_COURSES: createRoute('admin/courses'),
  ADMIN_COHORTS: createRoute('admin/cohorts'),

  // Student
  STUDENT_DASHBOARD: createRoute('student/dashboard'),
  STUDENT_COURSES: createRoute('student/courses'), // Base for /:courseId
  STUDENT_ASSIGNMENTS: createRoute('student/assignments'),
  UPDATE_STATUS: createRoute('admin/applicants/status'),
  
};

export const queryKeys = {
  APPLICANTS: 'applicants', 
  ADMIN_COURSES: 'admin_courses',
  ADMIN_COHORTS: 'admin_cohorts',
  STUDENT_DASHBOARD: 'student_dashboard',
  STUDENT_COURSE: 'student_course',
  STUDENT_MATERIALS: 'student_materials',
  STUDENT_ASSIGNMENTS: 'student_assignments',
};
