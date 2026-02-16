/**
 * Rails API client. Base URL from VITE_API_URL; token in localStorage.
 * All requests use Authorization: Bearer <token> when token is set.
 */

import type { User, AuthResponse, Location, FeedbackSubmission, Suggestion, ApiError } from '../types';

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api/v1';

const TOKEN_KEY = 'authToken';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
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
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    if (!res.ok) throw new Error(res.statusText || 'Request failed');
    throw new Error(text || 'Request failed');
  }
  if (!res.ok) {
    const err = data as ApiError;
    const msg = err?.error || res.statusText || 'Request failed';
    if (res.status === 404) {
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

  async signUp(params: { email: string; password: string; name?: string; business_name?: string }): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/sign_up', {
      method: 'POST',
      body: JSON.stringify({
        email: params.email,
        password: params.password,
        name: params.name,
        business_name: params.business_name,
      }),
      skipAuth: true,
    });
    setToken(data.token);
    return data;
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
};

export default api;
