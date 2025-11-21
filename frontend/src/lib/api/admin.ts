import { client } from '@/lib/api/client';
import { urls } from '@/lib/config/constants';
import { ApplicantsResponse } from '@/types/dashboard';

export const getApplicants = async () => {
  const response = await client.get<ApplicantsResponse>(urls.GET_APPLICANTS);
  return response.data;
};