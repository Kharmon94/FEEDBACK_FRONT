/**
 * Backend API types (Rails API uses snake_case in JSON).
 * Use these for API client and auth; design repo may keep its own types for UI.
 */

export interface User {
  id: number;
  email: string;
  name: string | null;
  business_name: string | null;
  plan: string;
  admin?: boolean;
  created_at?: string;
  trial_ends_at?: string | null;
  has_payment_method?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PageCopyFeedback {
  page_title?: string;
  rating_prompt?: string;
  comment_placeholder?: string;
  comment_helper?: string;
  suggestion_link?: string;
}

export interface PageCopySuggestions {
  page_title?: string;
  page_subtitle?: string;
  suggestion_placeholder?: string;
  submit_button?: string;
  privacy_note?: string;
  back_link?: string;
}

export interface PageCopyRewards {
  page_title?: string;
  page_subtitle?: string;
  consent_text?: string;
  join_button?: string;
  success_title?: string;
  success_message?: string;
}

export interface PageCopy {
  feedback?: PageCopyFeedback;
  suggestions?: PageCopySuggestions;
  rewards?: PageCopyRewards;
}

export interface Location {
  id: number;
  public_id?: string;
  name: string;
  slug?: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
  review_platforms: Record<string, string>;
  custom_message?: string | null;
  color_scheme?: { primary?: string; secondary?: string; accent?: string } | null;
  email_notifications?: boolean;
  notification_emails?: string[];
  opt_in_enabled?: boolean;
  opt_in_redirect_url?: string | null;
  page_copy?: PageCopy | null;
}

export interface FeedbackSubmission {
  id: number;
  location_id: number;
  rating: number;
  comment: string | null;
  customer_name: string | null;
  customer_email: string | null;
  created_at: string;
  device_type?: string | null;
  country?: string | null;
  region?: string | null;
}

export interface Suggestion {
  id: number;
  content: string;
  submitter_email: string | null;
  location_id: number | null;
  created_at: string;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
