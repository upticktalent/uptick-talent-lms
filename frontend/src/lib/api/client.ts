import { env, getAuthToken } from '@/lib/config';
import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const defaultConfig = {
  timeout: 60000,
};

const parseToken = (config: InternalAxiosRequestConfig) => {
  const publicEndpoints = [
    '/auth/login',
    '/login',
    '/applicants/createApplicant',
    '/apply',
  ];


  const isPublic = publicEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );

  if (!isPublic) {
    const token = getAuthToken();
    // Only add the header if we actually have a token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
};

export const client = axios.create({
  baseURL: env.BASE_URL,
  ...defaultConfig,
});

// Set up response interceptor
client.interceptors.response.use(
  response => Promise.resolve(response),
  error => {
    return Promise.reject(error);
  }
);

// Set up request interceptor
client.interceptors.request.use(parseToken);