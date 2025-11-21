import { Student, Mentor, CourseMaterial, Assessment, AttendanceRecord } from './lms';

export interface StudentDashboardResponse {
  code: number;
  message: string;
  payload: {
    student: Student;
    mentor: Mentor;
    activeCourseId: string; 
    progress: {
      completedWeeks: number;
      totalWeeks: number;
      averageScore: number;
      totalAssessments: number;
      completedAssessments: number;
    };
    upcomingClasses: {
      id: string;
      title: string;
      scheduledAt: string;
    }[];
  };
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