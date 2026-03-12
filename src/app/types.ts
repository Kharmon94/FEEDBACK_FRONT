export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  reviewPlatforms: ReviewPlatform[];
  createdAt: Date;
}

export interface ReviewPlatform {
  name: string;
  url: string;
  icon: 'google' | 'yelp' | 'facebook' | 'tripadvisor' | 'other';
}

export interface Feedback {
  id: string;
  businessId: string;
  rating: number;
  name?: string;
  email?: string;
  comment: string;
  images?: string[];
  type: 'feedback' | 'suggestion';
  createdAt: Date;
  deviceType?: string;
  country?: string;
  region?: string;
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