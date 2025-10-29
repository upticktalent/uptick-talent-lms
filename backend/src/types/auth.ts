import type { ApplicationStatus, Track } from '@prisma/client';

export type UserRole = string;



export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: UserRole;
  firstname: string;
  lastname: string;
  phone?: string;
  track?: Track;
  cohort?: string;
  expertise?: string[];
  department?: string;
}

export interface ApplicantInput {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  track: Track;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}



export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    profile?: any;
    student?: any;
    mentor?: any;
    admin?: any;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}