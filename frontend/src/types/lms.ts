export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  track: 'FRONTEND' | 'BACKEND' | 'FULLSTACK' | 'MOBILE';
  cohort: string;
  enrollmentDate: string;
  profilePicture?: string;
}

export interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  track: string;
  bio?: string;
  profilePicture?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface CourseMaterial {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'link' | 'assignment';
  url?: string;
  fileUrl?: string;
  uploadedAt: string;
  weekNumber: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  dueDate: string;
  maxScore: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedAt?: string;
  score?: number;
  feedback?: string;
  submissionUrl?: string;
  questions?: string[];
  tasks?: string[];
}

export interface Week {
  weekNumber: number;
  title: string;
  startDate: string;
  endDate: string;
  materials: CourseMaterial[];
  assessments: Assessment[];
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number; // in minutes
  googleMeetLink: string;
  status: 'upcoming' | 'live' | 'completed';
  attendance?: AttendanceRecord;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  joinedAt?: string;
  leftAt?: string;
  duration?: number; // in minutes
}

export interface StudentProfile {
  student: Student;
  mentor: Mentor;
  socialLinks: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    behance?: string;
    dribbble?: string;
    twitter?: string;
  };
  bio?: string;
  skills?: string[];
  progress: {
    completedWeeks: number;
    totalWeeks: number;
    averageScore: number;
    totalAssessments: number;
    completedAssessments: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

