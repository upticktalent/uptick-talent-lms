export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  SHORTLISTED = 'SHORTLISTED',
  ASSESSMENT_SENT = 'ASSESSMENT_SENT',
  ASSESSMENT_SUBMITTED = 'ASSESSMENT_SUBMITTED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEW_PASSED = 'INTERVIEW_PASSED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED'
}

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  track: string;
  dateOfBirth?: string;
  frontendTools?: string[];
  backendTools?: string[];
  mobileTools?: string[];
  referralSource?: string;
  applicationStatus: ApplicationStatus; 
  createdAt: string;
}

export interface DashboardStats {
  _count: {
    id: number;
  };
  applicationStatus: string;
}

export interface GetApplicantsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApplicantsResponse {
  code: number;
  message: string;
  status: boolean;
  payload: {
    applicants: Applicant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    stats: DashboardStats[];
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  track: string;
  level?: string;
  createdAt: string;
  _count?: {
    materials: number;
    assignments: number;
    students: number;
  };
}

export interface Cohort {
  id: string;
  name: string;
  track: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description?: string;
}

export interface CohortsResponse {
  code: number;
  message: string;
  status: boolean;
  payload: {
    cohorts: Cohort[]; 
  };
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  track: string;
  cohortId: string;
}

export interface AddMaterialPayload {
  courseId: string;
  title: string;
  type: 'VIDEO' | 'DOCUMENT' | 'LINK';
  url: string;
  weekNumber: number; 
}

export interface AddAssignmentPayload {
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface AssignStudentsPayload {
  courseId: string;
  studentIds: string[];
}

export interface CoursesResponse {
  code: number;
  message: string;
  status: boolean;
  payload: {
    courses: Course[];
  };
}