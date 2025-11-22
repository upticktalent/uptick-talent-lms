import { client } from '@/lib/api/client';
import { urls } from '@/lib/config/constants';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  status: boolean;
  payload: {
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'ADMIN' | 'STUDENT' | 'MENTOR'; 
      createdAt: string;
    };
  };
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await client.post<LoginResponse>(urls.LOGIN, payload);
  return response.data;
};