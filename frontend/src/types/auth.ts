export interface AuthErrorResponse {
  status: 'success' | 'error';
  message: string;
}

export type Users = 'student' | 'mentor';
