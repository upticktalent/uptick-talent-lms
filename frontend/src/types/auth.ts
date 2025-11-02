export interface AuthErrorResponse {
  status: 'success' | 'error';
  message: string;
}

export const Roles = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  STUDENT: 'student',
} as const;

export type Users = keyof typeof Roles;

export interface LoginFormValues {
  email: string;
  password: string;
}
