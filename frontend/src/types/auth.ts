export interface AuthErrorResponse {
  status: 'success' | 'error';
  message: string;
}

export type Users = 'student' | 'mentor';

export interface LoginFormValues {
  email: string;
  password: string;
}
