/**
 * API client wrapping Rails API (src/services/api).
 * Maps to the interface expected by components (Business, Feedback shapes).
 */

import { api as railsApi } from '../../services/api';
import type { Business, Feedback } from '../types';

function mapReviewPlatforms(platforms: Record<string, string>): { name: string; url: string; icon: 'google' | 'yelp' | 'facebook' | 'tripadvisor' | 'other' }[] {
  const icons: Record<string, 'google' | 'yelp' | 'facebook' | 'tripadvisor' | 'other'> = {
    google: 'google',
    yelp: 'yelp',
    facebook: 'facebook',
    tripadvisor: 'tripadvisor',
  };
  return Object.entries(platforms)
    .filter(([, url]) => url)
    .map(([name, url]) => ({
      name,
      url,
      icon: (icons[name.toLowerCase()] ?? 'other') as 'google' | 'yelp' | 'facebook' | 'tripadvisor' | 'other',
    }));
}

export const api = {
  async createBusiness(data: { id?: string; name?: string; businessName?: string; logoUrl?: string; platforms?: Record<string, string>; reviewPlatforms?: Array<{ name: string; url: string }> }) {
    const platforms: Record<string, string> = {};
    if (data.platforms) {
      Object.entries(data.platforms).forEach(([k, v]) => { if (typeof v === 'string' && v) platforms[k] = v; });
    } else if (data.reviewPlatforms) {
      data.reviewPlatforms.forEach((p) => { if (p.url) platforms[p.name] = p.url; });
    }
    await railsApi.updateOnboarding({
      business_name: data.businessName ?? data.name,
      name: data.name,
      logo_url: data.logoUrl,
      review_platforms: Object.keys(platforms).length ? platforms : undefined,
    });
  },

  async getBusiness(businessId: string) {
    const data = await railsApi.getOnboarding();
    const locs = await railsApi.getLocations();
    const loc = locs[0] ?? { id: 0, name: data.business_name ?? '', review_platforms: data.review_platforms ?? {} };
    return {
      id: String(loc.id),
      name: data.business_name ?? loc.name ?? '',
      logoUrl: data.logo_url ?? loc.logo_url ?? undefined,
      reviewPlatforms: mapReviewPlatforms(data.review_platforms ?? loc.review_platforms ?? {}),
      createdAt: new Date(),
    } as Business;
  },

  async updateBusiness(businessId: string, data: { name?: string; businessName?: string; logoUrl?: string; platforms?: Record<string, string> }) {
    const platforms: Record<string, string> = {};
    if (data.platforms) {
      Object.entries(data.platforms).forEach(([k, v]) => { if (typeof v === 'string' && v) platforms[k] = v; });
    }
    await railsApi.updateOnboarding({
      business_name: data.businessName ?? data.name,
      name: data.name,
      logo_url: data.logoUrl,
      review_platforms: Object.keys(platforms).length ? platforms : undefined,
    });
  },

  async getLocations() {
    const locs = await railsApi.getLocations();
    return locs.map((l) => ({
      id: String(l.id),
      name: l.name,
      slug: l.slug,
      address: '',
      phone: '',
      email: '',
      logoUrl: l.logo_url ?? undefined,
      reviewPlatforms: mapReviewPlatforms(l.review_platforms ?? {}),
      createdAt: '',
    }));
  },

  async getLocation(locationId: string) {
    const loc = await railsApi.getLocation(locationId) ?? await railsApi.getLocationPublic(locationId);
    if (!loc) throw new Error('Location not found');
    return {
      id: String(loc.id),
      name: loc.name,
      slug: loc.slug,
      address: '',
      phone: '',
      email: '',
      logoUrl: loc.logo_url ?? undefined,
      reviewPlatforms: mapReviewPlatforms(loc.review_platforms ?? {}),
      createdAt: '',
    };
  },

  async createLocation(data: { name: string; logoUrl?: string; platforms?: Record<string, string> }) {
    const platforms: Record<string, string> = {};
    if (data.platforms) {
      Object.entries(data.platforms).forEach(([k, v]) => { if (typeof v === 'string' && v) platforms[k] = v; });
    }
    const loc = await railsApi.createLocation({
      name: data.name,
      logo_url: data.logoUrl,
      review_platforms: Object.keys(platforms).length ? platforms : undefined,
    });
    return {
      id: String(loc.id),
      name: loc.name,
      slug: loc.slug,
      address: '',
      phone: '',
      email: '',
      logoUrl: loc.logo_url ?? undefined,
      reviewPlatforms: mapReviewPlatforms(loc.review_platforms ?? {}),
      createdAt: '',
    };
  },

  async updateLocation(locationId: string, data: { name?: string; logoUrl?: string; platforms?: Record<string, string> }) {
    const platforms: Record<string, string> | undefined = data.platforms
      ? Object.fromEntries(Object.entries(data.platforms).filter(([, v]) => typeof v === 'string' && v))
      : undefined;
    const loc = await railsApi.updateLocation(locationId, {
      name: data.name,
      logo_url: data.logoUrl,
      review_platforms: platforms,
    });
    return {
      id: String(loc.id),
      name: loc.name,
      slug: loc.slug,
      address: '',
      phone: '',
      email: '',
      logoUrl: loc.logo_url ?? undefined,
      reviewPlatforms: mapReviewPlatforms(loc.review_platforms ?? {}),
      createdAt: '',
    };
  },

  async deleteLocation(locationId: string) {
    await railsApi.deleteLocation(locationId);
  },

  async submitFeedback(data: {
    businessId: string;
    rating: number;
    name?: string;
    email?: string;
    phone?: string;
    contactMe?: boolean;
    comment: string;
    type: 'feedback' | 'suggestion';
  }): Promise<Feedback | null> {
    try {
      if (data.type === 'suggestion') {
        const s = await railsApi.createSuggestion({
          content: data.comment,
          submitter_email: data.email,
          location_id: data.businessId ? Number(data.businessId) || undefined : undefined,
        });
        return {
          id: String(s.id),
          businessId: data.businessId,
          rating: data.rating,
          name: data.name,
          email: data.email,
          comment: data.comment,
          type: 'suggestion',
          createdAt: new Date(s.created_at),
        } as Feedback;
      }
      const f = await railsApi.createFeedback({
        location_id: data.businessId,
        rating: data.rating,
        comment: data.comment,
        customer_name: data.name,
        customer_email: data.email,
        phone_number: data.phone,
        contact_me: data.contactMe,
      });
      return {
        id: String(f.id),
        businessId: data.businessId,
        rating: f.rating,
        name: f.customer_name ?? undefined,
        email: f.customer_email ?? undefined,
        comment: f.comment ?? '',
        type: 'feedback',
        createdAt: new Date(f.created_at),
      } as Feedback;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return null;
    }
  },

  async getFeedback(businessId?: string): Promise<Feedback[]> {
    try {
      const items = await railsApi.getFeedback();
      const filtered = businessId != null
        ? items.filter((f) => String(f.location_id) === businessId)
        : items;
      return filtered.map((f) => {
        const locId = String(f.location_id);
        return {
          id: String(f.id),
          businessId: locId,
          locationId: locId,
          rating: f.rating,
          name: f.customer_name ?? undefined,
          email: f.customer_email ?? undefined,
          comment: f.comment ?? '',
          type: 'feedback' as const,
          createdAt: new Date(f.created_at),
        };
      }) as Feedback[];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  },

  async initDemo(): Promise<boolean> {
    return false;
  },

  async submitOptIn(data: { businessId: string; name: string; email: string; phone: string }): Promise<boolean> {
    return false;
  },

  async getOptIns(businessId: string) {
    return [];
  },
};
