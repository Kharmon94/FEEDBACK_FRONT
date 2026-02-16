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
}