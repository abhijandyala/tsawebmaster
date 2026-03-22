export const CATEGORY_DISPLAY_ORDER = [
  'Restaurant', 'Cafe', 'Food', 'Food Assistance',
  'Healthcare', 'Pharmacy', 'Mental Health', 'Education',
  'Jobs', 'Housing', 'Financial', 'Legal', 'Transportation',
  'Fitness', 'Recreation', 'Entertainment', 'Nightlife',
  'Shopping', 'Services', 'Community Services', 'Auto',
  'Lodging', 'Government', 'Emergency', 'Youth Programs', 'Local Business',
] as const;

export type DisplayCategory = typeof CATEGORY_DISPLAY_ORDER[number] | 'Other';

export type Category =
  | 'Food Assistance'
  | 'Housing'
  | 'Healthcare'
  | 'Mental Health'
  | 'Education'
  | 'Jobs'
  | 'Transportation'
  | 'Youth Programs'
  | 'Emergency Help';

export type Cost = 'Free' | 'Low-cost' | 'Varies';

export type Format = 'In-person' | 'Online' | 'Hybrid';

export type Audience = 'Youth' | 'Families' | 'Seniors' | 'General';

export interface Resource {
  id: string;
  name: string;
  category: Category;
  description: string;
  address: string;
  city: string;
  neighborhood?: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  tags: string[];
  cost: Cost;
  format: Format;
  audience: Audience[];
  featured: boolean;
  languages: string[];
  eligibility?: string;
  services: string[];
  accessibilityNotes?: string;
  walkIn?: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface FilterState {
  search: string;
  categories: Category[];
  neighborhood: string;
  cost: Cost | '';
  format: Format | '';
  audience: Audience | '';
  openNow: boolean;
  sort: 'relevant' | 'alphabetical' | 'nearby';
}

export interface SubmissionFormData {
  organizationName: string;
  category: Category | '';
  description: string;
  address: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  audience: string;
  reason: string;
}
