import { Student, Mentor, CourseMaterial, Assessment } from './lms';

export interface Course {
  id: string;
  title: string;
  description?: string;
  
}

export interface StudentStats {
  totalCourses: number;
  totalAssignments: number;
  submittedAssignments: number;
  pendingAssignments: number;
}

export interface StudentDashboardResponse {
  code: number;
  message: string;
  payload: {
    student: Student;
    courses: Course[];
upcomingAssignments: Assessment[]; 
    recentMaterials: CourseMaterial[];
    stats: StudentStats;
    mentor?: Mentor; 
  };
  status: boolean;
}

export interface CourseMaterialsResponse {
  code: number;
  message: string;
  payload: CourseMaterial[];
}

export interface AssignmentsResponse {
  code: number;
  message: string;
  payload: Assessment[];
}

export interface AssignmentSubmissionPayload {
  assignmentId: string;
  content?: string;
  fileUrl?: string;
}