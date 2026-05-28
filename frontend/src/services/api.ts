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

export interface JobCreateData {
  title: string;
  description: string;
  category: string;
  budget: number;
  estimated_duration: string;
  urgency: 'low' | 'medium' | 'high';
  location: string;
  photos: string[];
}

export const jobsAPI = {
  create: async (userId: string, data: JobCreateData) => {
    const response = await api.post(`/jobs?user_id=${userId}`, data);
    return response.data;
  },
  
  getMyJobs: async (userId: string) => {
    const response = await api.get(`/jobs/my?user_id=${userId}`);
    return response.data;
  },
  
  getNearbyJobs: async (userId: string) => {
    const response = await api.get(`/jobs/nearby?user_id=${userId}`);
    return response.data;
  },
  
  getJob: async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },
  
  updateStatus: async (jobId: string, status: string, userId: string) => {
    const response = await api.put(`/jobs/${jobId}/status?status=${status}&user_id=${userId}`);
    return response.data;
  },
};

export const offersAPI = {
  createOffer: async (jobId: string, workerId: string, data: { proposed_price: number; message?: string }) => {
    const response = await api.post(`/jobs/${jobId}/offers?worker_id=${workerId}`, data);
    return response.data;
  },
  
  counterOffer: async (offerId: string, data: { counter_offer_price: number; counter_offer_message?: string }) => {
    const response = await api.post(`/offers/${offerId}/counter`, data);
    return response.data;
  },
  
  acceptOffer: async (offerId: string) => {
    const response = await api.post(`/offers/${offerId}/accept`);
    return response.data;
  },
  
  rejectOffer: async (offerId: string) => {
    const response = await api.post(`/offers/${offerId}/reject`);
    return response.data;
  },
  
  getWorkerOffers: async (workerId: string) => {
    const response = await api.get(`/worker/offers/${workerId}`);
    return response.data;
  },
};

export const notificationsAPI = {
  getNotifications: async (userId: string, type?: string) => {
    const response = await api.get(`/notifications/${userId}${type ? `?type=${type}` : ''}`);
    return response.data;
  },
  markAsRead: async (notificationId: string) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },
  markAllRead: async (userId: string) => {
    const response = await api.post(`/notifications/${userId}/read-all`);
    return response.data;
  },
};

export interface ReviewCreateData {
  job_id: string;
  worker_id: string;
  overall_rating: number;
  quality_rating: number;
  communication_rating: number;
  punctuality_rating: number;
  review_text?: string;
  recommend: boolean;
}

export const reviewsAPI = {
  create: async (userId: string, userName: string, data: ReviewCreateData) => {
    const response = await api.post(`/reviews?user_id=${userId}&user_name=${encodeURIComponent(userName)}`, data);
    return response.data;
  },
  getWorkerReviews: async (workerId: string) => {
    const response = await api.get(`/reviews/worker/${workerId}`);
    return response.data;
  },
};

export const historyAPI = {
  getJobHistory: async (userId: string, status?: string) => {
    const response = await api.get(`/jobs/history/${userId}${status ? `?status=${status}` : ''}`);
    return response.data;
  },
};

export const workerDashboardAPI = {
  getDashboard: async (workerId: string) => {
    const response = await api.get(`/worker/dashboard/${workerId}`);
    return response.data;
  },
  updateStatus: async (workerId: string, isOnline: boolean) => {
    const response = await api.put(`/worker/status/${workerId}`, { is_online: isOnline });
    return response.data;
  },
};

export default api;