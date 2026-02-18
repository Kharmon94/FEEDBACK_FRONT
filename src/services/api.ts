/**
 * Rails API client. Base URL from VITE_API_URL; token in localStorage.
 * All requests use Authorization: Bearer <token> when token is set.
 */

import type { User, AuthResponse, Location, FeedbackSubmission, Suggestion, ApiError } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const BASE_URL = API_BASE + '/api/v1';

const TOKEN_KEY = 'authToken';

/** URL to start Google OAuth (redirect the browser here). Must be absolute so production hits the API, not the frontend. */
export function getGoogleOAuthUrl(): string {
  const base = API_BASE || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  return `${base}/api/v1/auth/google_oauth2`;
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Base URL for API requests (exported for FormData uploads that cannot use request()). */
export function getBaseUrl(): string {
  return BASE_URL;
}

export async function request<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth, ...init } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (!skipAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : '';
    const isNetworkError =
      (e instanceof TypeError && errMsg.toLowerCase().includes('fetch')) ||
      errMsg.toLowerCase().includes('load failed') ||
      errMsg.toLowerCase().includes('networkerror');
    const msg = isNetworkError
      ? 'Cannot reach the API. Ensure the Rails server is running (rails server) and VITE_API_URL points to it.'
      : errMsg || 'Network error';
    throw new Error(msg);
  }
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    if (!res.ok) throw new Error(res.statusText || 'Request failed');
    throw new Error(text || 'Request failed');
  }
  if (!res.ok) {
    const err = data as ApiError & { error?: string | string[] };
    const raw = err?.error ?? res.statusText ?? 'Request failed';
    const msg = Array.isArray(raw) ? raw.join('. ') : String(raw);
    if (res.status === 404) {
      // Only add connection hint when response looks like a generic 404 (e.g. static server)
      const hasJsonError = data && typeof data === 'object' && 'error' in data;
      if (hasJsonError) {
        throw new Error(msg);
      }
      const apiUrl = import.meta.env.VITE_API_URL || '(same origin)';
      throw new Error(`${msg} — ensure the Rails API is running and VITE_API_URL (${apiUrl}) points to it.`);
    }
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  getToken,
  setToken,
  clearToken,

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/sign_in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    setToken(data.token);
    return data;
  },

  async signUp(params: { email: string; password: string; name?: string; business_name?: string }): Promise<AuthResponse | { message: string; requires_confirmation: true }> {
    const data = await request<AuthResponse | { message: string; requires_confirmation: true }>('/auth/sign_up', {
      method: 'POST',
      body: JSON.stringify({
        email: params.email,
        password: params.password,
        name: params.name,
        business_name: params.business_name,
      }),
      skipAuth: true,
    });
    if (!('requires_confirmation' in data && data.requires_confirmation)) {
      setToken((data as AuthResponse).token);
    }
    return data;
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ token, password }),
      skipAuth: true,
    });
  },

  async resendConfirmation(email: string): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/confirm/resend', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getToken();
    if (!token) return null;
    try {
      const { user } = await request<{ user: User }>('/auth/me');
      return user;
    } catch {
      clearToken();
      return null;
    }
  },

  signOut(): void {
    clearToken();
  },

  async getLocations(): Promise<Location[]> {
    const { locations } = await request<{ locations: Location[] }>('/locations');
    return locations;
  },

  async getLocation(id: string | number): Promise<Location | null> {
    try {
      const { location } = await request<{ location: Location }>(`/locations/${id}`);
      return location;
    } catch {
      return null;
    }
  },

  async createLocation(data: { name: string; logo_url?: string; review_platforms?: Record<string, string> }): Promise<Location> {
    const { location } = await request<{ location: Location }>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return location;
  },

  async updateLocation(id: string | number, data: { name?: string; logo_url?: string; review_platforms?: Record<string, string> }): Promise<Location> {
    const { location } = await request<{ location: Location }>(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return location;
  },

  async deleteLocation(id: string | number): Promise<void> {
    await request(`/locations/${id}`, { method: 'DELETE' });
  },

  async getLocationPublic(idOrSlug: string): Promise<Location | null> {
    try {
      const { location } = await request<{ location: Location }>(`/locations/public/${encodeURIComponent(idOrSlug)}`, { skipAuth: true });
      return location;
    } catch {
      return null;
    }
  },

  async createFeedback(params: { location_id: string; rating: number; comment?: string; customer_name?: string; customer_email?: string; phone_number?: string; contact_me?: boolean }): Promise<FeedbackSubmission> {
    const { feedback } = await request<{ feedback: FeedbackSubmission }>('/feedback', {
      method: 'POST',
      body: JSON.stringify(params),
      skipAuth: true,
    });
    return feedback;
  },

  async createSuggestion(params: { content: string; submitter_email?: string; location_id?: number | null }): Promise<Suggestion> {
    const { suggestion } = await request<{ suggestion: Suggestion }>('/suggestions', {
      method: 'POST',
      body: JSON.stringify(params),
      skipAuth: true,
    });
    return suggestion;
  },

  async getDashboard(): Promise<{ total_feedback: number; total_suggestions: number; average_rating: number | null; locations_count: number }> {
    return request('/dashboard');
  },

  async getPlans(): Promise<{ plans: Plan[] }> {
    return request<{ plans: Plan[] }>('/plans', { skipAuth: true });
  },

  async getFeedback(): Promise<FeedbackSubmission[]> {
    const { feedback } = await request<{ feedback: FeedbackSubmission[] }>('/feedback');
    return feedback;
  },

  async getSuggestions(): Promise<Suggestion[]> {
    const { suggestions } = await request<{ suggestions: Suggestion[] }>('/suggestions');
    return suggestions;
  },

  async getOnboarding(): Promise<{ business_name?: string; name?: string; logo_url?: string; review_platforms?: Record<string, string> }> {
    return request('/onboarding');
  },

  async updateOnboarding(data: { business_name?: string; name?: string; logo_url?: string; review_platforms?: Record<string, string> }): Promise<{ user: User }> {
    return request<{ user: User }>('/onboarding', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // --- Admin API (requires user.admin) ---

  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    return request<AdminDashboardResponse>('/admin/dashboard');
  },

  async getAdminPlans(): Promise<{ plans: AdminPlan[] }> {
    return request<{ plans: AdminPlan[] }>('/admin/plans');
  },

  async getAdminPlan(id: string): Promise<AdminPlan> {
    return request<AdminPlan>(`/admin/plans/${id}`);
  },

  async createAdminPlan(payload: AdminPlanUpsertPayload): Promise<AdminPlan> {
    return request<AdminPlan>('/admin/plans', { method: 'POST', body: JSON.stringify(payload) });
  },

  async updateAdminPlan(id: string, payload: AdminPlanUpsertPayload & { replacement_slug?: string }): Promise<AdminPlan> {
    return request<AdminPlan>(`/admin/plans/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },

  async deleteAdminPlan(id: string, payload?: { replacement_slug?: string; hard?: boolean }): Promise<AdminPlan | { success: true }> {
    return request<AdminPlan | { success: true }>(`/admin/plans/${id}`, { method: 'DELETE', body: JSON.stringify(payload ?? {}) });
  },

  async getAdminPlanUsage(id: string): Promise<AdminPlanUsage> {
    return request<AdminPlanUsage>(`/admin/plans/${id}/usage`);
  },

  async reassignAdminPlan(id: string, replacement_slug: string): Promise<{ updated_users_count: number }> {
    return request(`/admin/plans/${id}/reassign`, { method: 'POST', body: JSON.stringify({ replacement_slug }) });
  },

  async getAdminUsers(params?: { page?: number; per_page?: number; search?: string; plan?: string; status?: string }): Promise<AdminUsersResponse> {
    const sp = new URLSearchParams();
    if (params?.page != null) sp.set('page', String(params.page));
    if (params?.per_page != null) sp.set('per_page', String(params.per_page));
    if (params?.search) sp.set('search', params.search);
    if (params?.plan) sp.set('plan', params.plan);
    if (params?.status) sp.set('status', params.status);
    const q = sp.toString();
    return request<AdminUsersResponse>(`/admin/users${q ? `?${q}` : ''}`);
  },

  async getAdminUser(id: string): Promise<AdminUser> {
    return request<AdminUser>(`/admin/users/${id}`);
  },

  async createAdminUser(payload: { email: string; name?: string; password: string; plan?: string }): Promise<AdminUser> {
    return request<AdminUser>('/admin/users', { method: 'POST', body: JSON.stringify(payload) });
  },

  async suspendAdminUser(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/admin/users/${id}/suspend`, { method: 'PUT' });
  },

  async activateAdminUser(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/admin/users/${id}/activate`, { method: 'PUT' });
  },

  async updateAdminUser(id: string, payload: { admin?: boolean; plan?: string }): Promise<AdminUser> {
    return request<AdminUser>(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },

  async exportAdminUsers(): Promise<Blob> {
    return adminExport('/admin/users/export');
  },

  async getAdminLocations(params?: { page?: number; per_page?: number; search?: string; user_id?: string }): Promise<AdminLocationsResponse> {
    const sp = new URLSearchParams();
    if (params?.page != null) sp.set('page', String(params.page));
    if (params?.per_page != null) sp.set('per_page', String(params.per_page));
    if (params?.search) sp.set('search', params.search);
    if (params?.user_id) sp.set('user_id', params.user_id);
    const q = sp.toString();
    return request<AdminLocationsResponse>(`/admin/locations${q ? `?${q}` : ''}`);
  },

  async getAdminLocation(id: string): Promise<AdminLocation> {
    return request<AdminLocation>(`/admin/locations/${id}`);
  },

  async createAdminLocation(payload: { user_id: string; name: string }): Promise<AdminLocation> {
    return request<AdminLocation>('/admin/locations', { method: 'POST', body: JSON.stringify(payload) });
  },

  async exportAdminLocations(): Promise<Blob> {
    return adminExport('/admin/locations/export');
  },

  async getAdminFeedback(params?: { page?: number; per_page?: number; location_id?: string; user_id?: string; rating?: number }): Promise<AdminFeedbackResponse> {
    const sp = new URLSearchParams();
    if (params?.page != null) sp.set('page', String(params.page));
    if (params?.per_page != null) sp.set('per_page', String(params.per_page));
    if (params?.location_id) sp.set('location_id', params.location_id);
    if (params?.user_id) sp.set('user_id', params.user_id);
    if (params?.rating != null) sp.set('rating', String(params.rating));
    const q = sp.toString();
    return request<AdminFeedbackResponse>(`/admin/feedback${q ? `?${q}` : ''}`);
  },

  async getAdminFeedbackItem(id: string): Promise<AdminFeedbackItem> {
    return request<AdminFeedbackItem>(`/admin/feedback/${id}`);
  },

  async exportAdminFeedback(): Promise<Blob> {
    return adminExport('/admin/feedback/export');
  },

  async getAdminAnalytics(params?: { range?: string }): Promise<AdminAnalyticsResponse> {
    const q = params?.range ? `?range=${encodeURIComponent(params.range)}` : '';
    return request<AdminAnalyticsResponse>(`/admin/analytics${q}`);
  },

  async exportAdminAnalytics(): Promise<Blob> {
    return adminExport('/admin/analytics/export');
  },

  async getAdminSettings(): Promise<AdminSettings> {
    return request<AdminSettings>('/admin/settings');
  },

  async updateAdminSettings(payload: Partial<AdminSettings>): Promise<{ success: boolean; message: string; settings: AdminSettings }> {
    return request('/admin/settings', { method: 'PUT', body: JSON.stringify(payload) });
  },

  async getAdminSuggestions(params?: { page?: number; per_page?: number; location_id?: string; user_id?: string }): Promise<AdminSuggestionsResponse> {
    const sp = new URLSearchParams();
    if (params?.page != null) sp.set('page', String(params.page));
    if (params?.per_page != null) sp.set('per_page', String(params.per_page));
    if (params?.location_id) sp.set('location_id', params.location_id);
    if (params?.user_id) sp.set('user_id', params.user_id);
    const q = sp.toString();
    return request<AdminSuggestionsResponse>(`/admin/suggestions${q ? `?${q}` : ''}`);
  },

  async getAdminSuggestion(id: string): Promise<AdminSuggestion> {
    return request<AdminSuggestion>(`/admin/suggestions/${id}`);
  },

  async exportAdminSuggestions(): Promise<Blob> {
    return adminExport('/admin/suggestions/export');
  },
};

/** Fetch admin CSV export with auth; returns blob for download. */
async function adminExport(path: string): Promise<Blob> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized. Sign in as an admin.');
  }
  if (!res.ok) throw new Error(res.statusText || 'Export failed');
  return res.blob();
}

/** Trigger browser download of a blob (e.g. CSV). */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Admin API response types (snake_case from Rails)
export interface AdminDashboardResponse {
  total_users: number;
  active_users: number;
  total_locations: number;
  total_feedback: number;
  avg_rating: number | null;
  recent_activity: AdminRecentActivityItem[];
}

export interface AdminRecentActivityItem {
  type: 'user' | 'location' | 'feedback';
  id: string;
  message: string;
  created_at: string;
  user_name?: string;
  location_name?: string;
}

export interface Plan {
  id: string;
  slug: string;
  name: string;
  monthly_price_cents: number | null;
  yearly_price_cents: number | null;
  location_limit: number | null;
  features: string[];
  cta: string | null;
  highlighted: boolean;
  display_order: number;
}

export interface AdminPlan extends Plan {
  active: boolean;
}

export interface AdminPlanUsage {
  plan_id: string;
  slug: string;
  users_count: number;
}

export type AdminPlanUpsertPayload = {
  slug?: string;
  name?: string;
  monthly_price_cents?: number | null;
  yearly_price_cents?: number | null;
  location_limit?: number | null;
  features?: string[];
  cta?: string | null;
  highlighted?: boolean;
  display_order?: number;
  active?: boolean;
};

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  admin?: boolean;
  status: string;
  locations_count: number;
  feedback_count: number;
  created_at: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: { current_page: number; total_pages: number; total_count: number; per_page: number };
}

export interface AdminLocation {
  id: string;
  name: string;
  user_id: string;
  user_name: string | null;
  user_email: string;
  feedback_count: number;
  avg_rating: number | null;
  created_at: string;
}

export interface AdminLocationsResponse {
  locations: AdminLocation[];
  pagination: { current_page: number; total_pages: number; total_count: number; per_page: number };
}

export interface AdminFeedbackItem {
  id: string;
  rating: number;
  comment: string | null;
  location_id: string;
  location_name: string;
  user_id: string;
  user_name: string | null;
  user_email: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
}

export interface AdminFeedbackResponse {
  feedback: AdminFeedbackItem[];
  pagination: { current_page: number; total_pages: number; total_count: number; per_page: number };
}

export interface AdminAnalyticsResponse {
  revenue: { total: number; growth: number; by_plan: unknown[] };
  users: { total: number; growth: number; new_this_month: number; churn_rate: number };
  feedback: {
    total: number;
    growth: number;
    avg_rating: number | null;
    rating_distribution: { rating: number; count: number }[];
  };
  top_locations: { id: string; name: string; owner?: string; feedback_count?: number; avg_rating?: number }[];
  top_users: { id: string; name: string; plan?: string; locations_count?: number }[];
}

export interface AdminSettings {
  site_name: string;
  support_email: string;
  max_locations_per_user: number;
  enable_user_registration: boolean;
  enable_email_verification: boolean;
  enable_social_login: boolean;
  notify_on_new_feedback: boolean;
  notify_on_new_suggestion: boolean;
}

export interface AdminSuggestion {
  id: string;
  content: string;
  submitter_email: string | null;
  location_id: string | null;
  location_name: string | null;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  created_at: string;
}

export interface AdminSuggestionsResponse {
  suggestions: AdminSuggestion[];
  pagination: { current_page: number; total_pages: number; total_count: number; per_page: number };
}

export default api;
