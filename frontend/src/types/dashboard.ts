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
  applicationStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ASSESSMENT_SENT' | 'INTERVIEW_SCHEDULED';
  createdAt: string;
}

export interface DashboardStats {
  _count: {
    id: number;
  };
  applicationStatus: string;
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