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

export interface ServiceItem {
  id: string;
  label: string;
  icon: string;
  group: string;
  popular?: boolean;
}

export interface ServicesResponse {
  success: boolean;
  services: ServiceItem[];
  groups: string[];
  grouped: Record<string, ServiceItem[]>;
  popular: ServiceItem[];
  total: number;
}

export const servicesAPI = {
  getCategories: async (): Promise<ServicesResponse> => {
    const response = await api.get('/services/categories');
    return response.data;
  },
};

// ==================== CHAT ====================

export interface ChatOtherUser {
  id: string;
  name: string;
  role: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message: string | null;
  last_sender_id: string | null;
  last_message_at: string | null;
  job_id: string | null;
  created_at: string;
  updated_at: string;
  other_user: ChatOtherUser | null;
  unread_count: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  read_by: string[];
  created_at: string;
}

export const chatAPI = {
  listConversations: async (userId: string) => {
    const r = await api.get(`/conversations?user_id=${userId}`);
    return r.data as { success: boolean; conversations: Conversation[]; total_unread: number };
  },

  createOrGet: async (userId: string, otherUserId: string, jobId?: string) => {
    const r = await api.post(`/conversations?user_id=${userId}`, {
      other_user_id: otherUserId,
      job_id: jobId,
    });
    return r.data as { success: boolean; conversation: Conversation };
  },

  getConversation: async (convId: string, userId: string) => {
    const r = await api.get(`/conversations/${convId}?user_id=${userId}`);
    return r.data as { success: boolean; conversation: Conversation };
  },

  getMessages: async (convId: string, userId: string) => {
    const r = await api.get(`/conversations/${convId}/messages?user_id=${userId}`);
    return r.data as { success: boolean; messages: ChatMessage[] };
  },

  sendMessage: async (convId: string, userId: string, text: string) => {
    const r = await api.post(`/conversations/${convId}/messages?user_id=${userId}`, { text });
    return r.data as { success: boolean; message: ChatMessage };
  },

  markRead: async (convId: string, userId: string) => {
    const r = await api.post(`/conversations/${convId}/read?user_id=${userId}`);
    return r.data as { success: boolean };
  },
};

/** Build the WebSocket URL for a given user. */
export function buildChatWsUrl(userId: string): string {
  const base = process.env.EXPO_PUBLIC_BACKEND_URL || '';
  // Convert http(s) -> ws(s)
  const wsBase = base.replace(/^http/i, 'ws');
  return `${wsBase}/api/ws/chat/${userId}`;
}

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