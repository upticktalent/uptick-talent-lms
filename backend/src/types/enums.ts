export enum UserRole {
  APPLICANT = 'applicant',
  STUDENT = 'student',
  ADMIN = 'admin',
  MENTOR = 'mentor',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REJECTED = 'rejected',
  INVITED = 'invited',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  SHORTLISTED = 'shortlisted',
  QUALIFIED = 'qualified',
  REJECTED = 'rejected',
}

export enum TrackType {
  FELLOWSHIP = 'fellowship',
  EXPERT_LED = 'expert-led',
}

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

export enum InterviewStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum InterviewOutcome {
  PASS = 'pass',
  FAIL = 'fail',
}

export enum AdminPermissions {
  MANAGE_APPLICATIONS = 'manageApplications',
  SEND_INVITES = 'sendInvites',
  MANAGE_LMS = 'manageLMS',
}