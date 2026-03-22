import { Resource, Category } from '@/lib/types';
import { curatedResources } from './curated-resources';

export const categories: { name: Category; icon: string; description: string }[] = [
  { name: 'Food Assistance', icon: 'utensils', description: 'Food banks, meal programs, and nutrition support' },
  { name: 'Housing', icon: 'home', description: 'Rental assistance, shelters, and housing programs' },
  { name: 'Healthcare', icon: 'heart-pulse', description: 'Medical care, clinics, and health services' },
  { name: 'Mental Health', icon: 'brain', description: 'Counseling, therapy, and mental health support' },
  { name: 'Education', icon: 'graduation-cap', description: 'Tutoring, GED programs, and learning resources' },
  { name: 'Jobs', icon: 'briefcase', description: 'Employment services, training, and career support' },
  { name: 'Transportation', icon: 'car', description: 'Transit assistance, ride programs, and mobility support' },
  { name: 'Youth Programs', icon: 'users', description: 'After-school, mentorship, and youth development' },
  { name: 'Emergency Help', icon: 'shield-alert', description: 'Crisis services, emergency shelter, and urgent aid' },
];

export const neighborhoods = [
  'Uptown Charlotte',
  'South End',
  'NoDa',
  'Plaza Midwood',
  'Dilworth',
  'Myers Park',
  'University City',
  'Ballantyne',
  'Huntersville',
  'Lake Norman',
  'Matthews',
  'Pineville',
  'Concord',
  'Harrisburg',
  'Kannapolis',
  'Waxhaw',
  'Weddington',
  'Marvin',
];

export const CHARLOTTE_AREA = {
  center: { lat: 35.2271, lng: -80.8431 },
  bounds: {
    north: 35.5,
    south: 34.9,
    east: -80.5,
    west: -81.1
  },
  regions: [
    'Charlotte', 'Lake Norman', 'Huntersville',
    'Matthews', 'Pineville', 'Waxhaw', 'Weddington',
    'Marvin', 'Concord', 'Harrisburg', 'Kannapolis'
  ]
};

export const resources: Resource[] = curatedResources;

export function getResourcesByCategory(category: Category): Resource[] {
  return resources.filter((r) => r.category === category);
}

export function getFeaturedResources(): Resource[] {
  return resources.filter((r) => r.featured);
}

export function searchResources(query: string): Resource[] {
  const lowercaseQuery = query.toLowerCase();
  return resources.filter(
    (r) =>
      r.name.toLowerCase().includes(lowercaseQuery) ||
      r.description.toLowerCase().includes(lowercaseQuery) ||
      r.category.toLowerCase().includes(lowercaseQuery) ||
      r.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      r.services.some((service) => service.toLowerCase().includes(lowercaseQuery))
  );
}
