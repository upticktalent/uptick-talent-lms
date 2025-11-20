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
  GET_APPLICANTS: createRoute('admin/applicants'),
};

export const queryKeys = {
  APPLICANTS: 'applicants', 
};
