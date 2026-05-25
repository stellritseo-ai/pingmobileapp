export type UserRole = 'normal_user' | 'individual_worker' | 'business_owner';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email?: string;
  mobile?: string;
  full_name: string;
  role: UserRole;
  is_verified: boolean;
  worker_verified: boolean;
  business_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkerVerification {
  id: string;
  user_id: string;
  front_id: string;
  back_id: string;
  selfie: string;
  status: VerificationStatus;
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface BusinessVerification {
  id: string;
  user_id: string;
  business_name: string;
  business_category: string;
  business_address: string;
  phone_number: string;
  business_email: string;
  business_license: string;
  tax_document?: string;
  logo?: string;
  cover_image?: string;
  service_categories: string[];
  service_radius: number;
  business_location: any;
  status: VerificationStatus;
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
}