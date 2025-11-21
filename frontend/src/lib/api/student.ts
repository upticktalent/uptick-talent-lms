import { client } from '@/lib/api/client';
import { urls } from '@/lib/config/constants';
import { 
  StudentDashboardResponse, 
  CourseMaterialsResponse, 
  AssignmentsResponse, 
  AssignmentSubmissionPayload 
} from '@/types/student';

export const getStudentDashboard = async () => {
  const response = await client.get<StudentDashboardResponse>(urls.STUDENT_DASHBOARD);
  return response.data;
};

export const getCourseMaterials = async (courseId: string) => {
  const url = `${urls.STUDENT_COURSES}/${courseId}/materials`;
  const response = await client.get<CourseMaterialsResponse>(url);
  return response.data;
};

export const getAssignments = async (params?: { status?: string; courseId?: string }) => {
  const response = await client.get<AssignmentsResponse>(urls.STUDENT_ASSIGNMENTS, { params });
  return response.data;
};

export const submitAssignment = async ({ assignmentId, ...data }: AssignmentSubmissionPayload) => {
  const url = `${urls.STUDENT_ASSIGNMENTS}/${assignmentId}/submit`;
  const response = await client.post(url, data);
  return response.data;
};