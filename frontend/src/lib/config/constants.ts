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

  // Student
  STUDENT_DASHBOARD: createRoute('student/dashboard'),
  STUDENT_COURSES: createRoute('student/courses'), // Base for /:courseId
  STUDENT_ASSIGNMENTS: createRoute('student/assignments'),
};

export const queryKeys = {
  STUDENT_DASHBOARD: 'student_dashboard',
  STUDENT_COURSE: 'student_course',
  STUDENT_MATERIALS: 'student_materials',
  STUDENT_ASSIGNMENTS: 'student_assignments',
};
