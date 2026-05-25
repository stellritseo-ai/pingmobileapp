import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterData {
  email?: string;
  mobile?: string;
  full_name: string;
  password: string;
  role: 'normal_user' | 'individual_worker' | 'business_owner';
}

export interface LoginData {
  email_or_mobile: string;
  password: string;
}

export interface VerifyOTPData {
  email_or_mobile: string;
  otp: string;
}

export const authAPI = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  verifyOTP: async (data: VerifyOTPData) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },
  
  sendOTP: async (email_or_mobile: string) => {
    const response = await api.post('/auth/send-otp', { email_or_mobile });
    return response.data;
  },
};

export const userAPI = {
  getProfile: async (userId: string) => {
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  },
  
  becomeWorker: async (userId: string, data: any) => {
    const response = await api.post(`/user/become-worker?user_id=${userId}`, data);
    return response.data;
  },
};

export const workerAPI = {
  submitVerification: async (userId: string, data: any) => {
    const response = await api.post(`/worker/verification?user_id=${userId}`, data);
    return response.data;
  },
  
  getVerification: async (userId: string) => {
    const response = await api.get(`/worker/verification/${userId}`);
    return response.data;
  },
};

export const businessAPI = {
  submitVerification: async (userId: string, data: any) => {
    const response = await api.post(`/business/verification?user_id=${userId}`, data);
    return response.data;
  },
  
  getVerification: async (userId: string) => {
    const response = await api.get(`/business/verification/${userId}`);
    return response.data;
  },
};

export default api;