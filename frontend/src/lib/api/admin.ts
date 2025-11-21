import { client } from '@/lib/api/client';
import { urls } from '@/lib/config/constants';
import { ApplicantsResponse, GetApplicantsParams, ApplicationStatus, CoursesResponse, CreateCoursePayload, AddMaterialPayload, AddAssignmentPayload, AssignStudentsPayload, CohortsResponse } from '@/types/dashboard';

export const getApplicants = async (params?: GetApplicantsParams) => {
  // Pass params (page, limit, search) as query string
  const response = await client.get<ApplicantsResponse>(urls.GET_APPLICANTS, {
    params,
  });
  return response.data;
};

export const updateApplicantStatus = async (data: { applicantId: string; status: ApplicationStatus }) => {
  const response = await client.put(urls.UPDATE_STATUS, data);
  return response.data;
};

export interface SendAssessmentPayload {
  applicantIds: string[];
  assessmentLink: string;
  dueDate: string; // ISO Date string
  instructions: string;
}

export const sendAssessment = async (data: SendAssessmentPayload) => {
  const response = await client.post(urls.SEND_ASSESSMENT, data);
  return response.data;
};

export const getAdminCourses = async () => {
  const response = await client.get<CoursesResponse>(urls.ADMIN_COURSES);
  return response.data;
};

export const createCourse = async (data: CreateCoursePayload) => {
  const response = await client.post(urls.ADMIN_COURSES, data);
  return response.data;
};

export const addCourseMaterial = async ({ courseId, ...data }: AddMaterialPayload) => {
  const url = `${urls.ADMIN_COURSES}/${courseId}/materials`;
  const response = await client.post(url, data);
  return response.data;
};

export const addCourseAssignment = async ({ courseId, ...data }: AddAssignmentPayload) => {
  const url = `${urls.ADMIN_COURSES}/${courseId}/assignments`;
  const response = await client.post(url, data);
  return response.data;
};

export const assignStudentsToCourse = async ({ courseId, studentIds }: AssignStudentsPayload) => {
  const url = `${urls.ADMIN_COURSES}/${courseId}/assign-students`;
  const response = await client.post(url, { studentIds });
  return response.data;
};

export const getAdminCohorts = async () => {
  const response = await client.get<CohortsResponse>(urls.ADMIN_COHORTS);
  return response.data;
};