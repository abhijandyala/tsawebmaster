import { ParsedQuery } from './queryParser';
import { resources, CHARLOTTE_AREA } from '@/data/resources';
import { Resource, CATEGORY_DISPLAY_ORDER } from './types';

export type EligibilityStatus = 'likely' | 'possible' | 'check' | 'unknown';
export type SourceType = 'government' | 'nonprofit' | 'community' | 'private' | 'unknown';

export interface TransitInfo {
  nearLightRail: boolean;
  lightRailStation?: string;
  nearBusRoute: boolean;
  busRoutes?: string[];
  transitAccessible: boolean;
}

const LIGHT_RAIL_STATIONS = [
  { name: 'I-485/South Blvd', lat: 35.1073, lng: -80.8795 },
  { name: 'Sharon Road West', lat: 35.1239, lng: -80.8760 },
  { name: 'Arrowood', lat: 35.1394, lng: -80.8716 },
  { name: 'Archdale', lat: 35.1547, lng: -80.8673 },
  { name: 'Tyvola', lat: 35.1677, lng: -80.8647 },
  { name: 'Woodlawn', lat: 35.1838, lng: -80.8602 },
  { name: 'Scaleybark', lat: 35.1961, lng: -80.8569 },
  { name: 'New Bern', lat: 35.2052, lng: -80.8537 },
  { name: 'East/West Blvd', lat: 35.2120, lng: -80.8497 },
  { name: 'Bland Street', lat: 35.2189, lng: -80.8456 },
  { name: 'Carson', lat: 35.2214, lng: -80.8430 },
  { name: 'Brooklyn Village', lat: 35.2253, lng: -80.8435 },
  { name: 'Charlotte Transportation Center', lat: 35.2270, lng: -80.8432 },
  { name: '3rd Street', lat: 35.2285, lng: -80.8410 },
  { name: '7th Street', lat: 35.2311, lng: -80.8375 },
  { name: '9th Street', lat: 35.2349, lng: -80.8350 },
  { name: 'Parkwood', lat: 35.2412, lng: -80.8283 },
  { name: '25th Street', lat: 35.2467, lng: -80.8214 },
  { name: '36th Street', lat: 35.2521, lng: -80.8127 },
  { name: 'Sugar Creek', lat: 35.2590, lng: -80.8030 },
  { name: 'Old Concord Road', lat: 35.2697, lng: -80.7901 },
  { name: 'Tom Hunter', lat: 35.2756, lng: -80.7801 },
  { name: 'University City Blvd', lat: 35.2834, lng: -80.7675 },
  { name: 'McCullough', lat: 35.2905, lng: -80.7565 },
  { name: 'JW Clay Blvd/UNC Charlotte', lat: 35.3076, lng: -80.7303 },
];

const MAJOR_BUS_CORRIDORS = [
  { name: 'South Blvd', routes: ['27', '39'] },
  { name: 'Central Ave', routes: ['4', '39X'] },
  { name: 'Independence Blvd', routes: ['51', '54'] },
  { name: 'Freedom Dr', routes: ['23'] },
  { name: 'Beatties Ford Rd', routes: ['11', '22'] },
  { name: 'North Tryon', routes: ['9', '29'] },
  { name: 'Albemarle Rd', routes: ['39', '10'] },
  { name: 'Wilkinson Blvd', routes: ['5'] },
];

export interface SearchResult {
  id: string;
  source: 'curated' | 'google_places' | 'web';
  name: string;
  description: string;
  category: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  rating?: number;
  reviewCount?: number;
  reviewHighlights?: string[];
  priceLevel?: number;
  isOpen?: boolean;
  phone?: string;
  website?: string;
  distance?: number;
  placeId?: string;
  photos?: string[];
  types?: string[];
  eligibility?: string;
  eligibilityTags?: string[];
  eligibilityStatus?: EligibilityStatus;
  sourceType?: SourceType;
  lastUpdated?: string;
  verified?: boolean;
  transitInfo?: TransitInfo;
  languages?: string[];
  walkIn?: boolean;
  cost?: string;
  matchReasons?: string[];
}

export interface GroupedResults {
  category: string;
  results: SearchResult[];
  count: number;
}

export function searchCuratedResources(parsed: ParsedQuery): SearchResult[] {
  const hasCategories = parsed.categories.length > 0;
  const hasSearchTerms = parsed.searchTerms.length > 0;
  const requiresFree = parsed.attributes.includes('free');
  const lowerCategories = parsed.categories.map(c => c.toLowerCase());
  const lowerTerms = parsed.searchTerms.map(t => t.toLowerCase());

  const results = resources.filter(r => {
    if (requiresFree && r.cost !== 'Free') return false;
    
    if (hasCategories) {
      const categoryMatch = lowerCategories.some(c => 
        r.category.toLowerCase().includes(c)
      );
      if (!categoryMatch) return false;
    }
    
    if (hasSearchTerms) {
      const searchText = `${r.name} ${r.description} ${r.tags.join(' ')} ${r.services.join(' ')}`.toLowerCase();
      const termMatch = lowerTerms.some(term => searchText.includes(term));
      if (!termMatch) return false;
    }
    
    return true;
  });

  return results.map(resourceToSearchResult);
}

function inferSourceType(resource: Resource): SourceType {
  const name = resource.name.toLowerCase();
  const desc = resource.description.toLowerCase();
  const combined = `${name} ${desc}`;
  
  const governmentKeywords = ['county', 'city of', 'mecklenburg', 'government', 'state', 'department', 'municipal'];
  const nonprofitKeywords = ['ministry', 'foundation', 'association', 'council', 'coalition', 'alliance', 'society', 'institute'];
  
  if (governmentKeywords.some(kw => combined.includes(kw))) {
    return 'government';
  }
  
  if (nonprofitKeywords.some(kw => combined.includes(kw)) || resource.cost === 'Free') {
    return 'nonprofit';
  }
  
  return 'community';
}

function extractEligibilityTags(eligibilityText?: string): string[] {
  if (!eligibilityText) return [];
  
  const tags: string[] = [];
  const lower = eligibilityText.toLowerCase();
  
  const tagPatterns: Record<string, string[]> = {
    'family': ['family', 'families', 'children', 'kids', 'parent'],
    'senior': ['senior', 'elderly', '65+', 'older adult'],
    'veteran': ['veteran', 'military', 'service member'],
    'youth': ['youth', 'teen', 'young adult', 'minor', 'under 18'],
    'homeless': ['homeless', 'housing insecure', 'unhoused'],
    'low-income': ['low income', 'low-income', 'poverty', 'medicaid', 'snap'],
    'uninsured': ['uninsured', 'no insurance', 'without insurance'],
    'immigrant': ['immigrant', 'refugee', 'newcomer'],
    'disabled': ['disabled', 'disability', 'special needs'],
  };
  
  for (const [tag, patterns] of Object.entries(tagPatterns)) {
    if (patterns.some(p => lower.includes(p))) {
      tags.push(tag);
    }
  }
  
  if (lower.includes('anyone') || lower.includes('all residents') || lower.includes('no requirements')) {
    tags.push('general');
  }
  
  return tags;
}

function resourceToSearchResult(resource: Resource): SearchResult {
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };
  
  const idHash = hashCode(resource.id);
  const latOffset = ((idHash % 100) / 100 - 0.5) * 0.05;
  const lngOffset = (((idHash >> 8) % 100) / 100 - 0.5) * 0.05;
  
  const lat = resource.coordinates?.lat || CHARLOTTE_AREA.center.lat + latOffset;
  const lng = resource.coordinates?.lng || CHARLOTTE_AREA.center.lng + lngOffset;
  
  return {
    id: `curated-${resource.id}`,
    source: 'curated',
    name: resource.name,
    description: resource.description,
    category: resource.category,
    location: {
      address: `${resource.address}, ${resource.city}`,
      lat,
      lng,
    },
    phone: resource.phone,
    website: resource.website,
    isOpen: undefined,
    eligibility: resource.eligibility,
    eligibilityTags: extractEligibilityTags(resource.eligibility),
    sourceType: inferSourceType(resource),
    verified: true,
    lastUpdated: '2026-03-01',
    transitInfo: getTransitInfo(lat, lng),
    languages: resource.languages,
    walkIn: resource.walkIn,
    cost: resource.cost,
  };
}

function calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getTransitInfo(lat: number, lng: number): TransitInfo {
  let nearestStation: { name: string; distance: number } | null = null;
  
  for (const station of LIGHT_RAIL_STATIONS) {
    const distance = calculateHaversineDistance(lat, lng, station.lat, station.lng);
    if (distance < 0.5) {
      if (!nearestStation || distance < nearestStation.distance) {
        nearestStation = { name: station.name, distance };
      }
    }
  }
  
  const nearBusRoutes: string[] = [];
  const addressText = `${lat},${lng}`;
  
  for (const corridor of MAJOR_BUS_CORRIDORS) {
    const corridorCenter = CHARLOTTE_AREA.center;
    const distanceToCenter = calculateHaversineDistance(lat, lng, corridorCenter.lat, corridorCenter.lng);
    if (distanceToCenter < 10) {
      nearBusRoutes.push(...corridor.routes.slice(0, 1));
    }
  }
  
  const uniqueRoutes = [...new Set(nearBusRoutes)].slice(0, 3);
  
  return {
    nearLightRail: !!nearestStation,
    lightRailStation: nearestStation?.name,
    nearBusRoute: uniqueRoutes.length > 0,
    busRoutes: uniqueRoutes.length > 0 ? uniqueRoutes : undefined,
    transitAccessible: !!nearestStation || uniqueRoutes.length > 0,
  };
}

export function determineEligibilityStatus(
  result: SearchResult, 
  userTags?: string[]
): EligibilityStatus {
  if (!result.eligibilityTags || result.eligibilityTags.length === 0) {
    return 'unknown';
  }
  
  if (result.eligibilityTags.includes('general')) {
    return 'likely';
  }
  
  if (!userTags || userTags.length === 0) {
    return 'check';
  }
  
  const matchCount = result.eligibilityTags.filter(tag => 
    userTags.includes(tag)
  ).length;
  
  if (matchCount >= 2) return 'likely';
  if (matchCount === 1) return 'possible';
  
  return 'check';
}

export function mergePlacesResults(
  places: Array<{
    id: string;
    placeId: string;
    name: string;
    address: string;
    location: { lat: number; lng: number };
    rating?: number;
    userRatingsTotal?: number;
    priceLevel?: number;
    types: string[];
    isOpen?: boolean;
    photos?: string[];
  }>,
  queryTerms: string[]
): SearchResult[] {
  return places.map(place => ({
    id: `google-${place.placeId}`,
    source: 'google_places' as const,
    name: place.name,
    description: `Found via Google Maps`,
    category: inferCategoryFromTypes(place.types),
    location: {
      address: place.address,
      lat: place.location.lat,
      lng: place.location.lng,
    },
    rating: place.rating,
    reviewCount: place.userRatingsTotal,
    priceLevel: place.priceLevel,
    isOpen: place.isOpen,
    placeId: place.placeId,
    photos: place.photos,
    types: place.types,
  }));
}

function inferCategoryFromTypes(types: string[]): string {
  const highPriorityTypes: Record<string, string> = {
    bank: 'Financial',
    atm: 'Financial',
    hospital: 'Healthcare',
    doctor: 'Healthcare',
    dentist: 'Healthcare',
    pharmacy: 'Pharmacy',
    drugstore: 'Pharmacy',
    police: 'Emergency',
    fire_station: 'Emergency',
    lawyer: 'Legal',
    university: 'Education',
    school: 'Education',
    library: 'Education',
    church: 'Community Services',
    local_government_office: 'Government',
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    bar: 'Nightlife',
    night_club: 'Nightlife',
    gym: 'Fitness',
    park: 'Recreation',
    museum: 'Entertainment',
    movie_theater: 'Entertainment',
    hotel: 'Lodging',
    lodging: 'Lodging',
    transit_station: 'Transportation',
    bus_station: 'Transportation',
    gas_station: 'Auto',
    car_repair: 'Auto',
    real_estate_agency: 'Housing',
    employment_agency: 'Jobs',
  };

  const lowPriorityTypes: Record<string, string> = {
    food: 'Food',
    bakery: 'Bakery',
    meal_delivery: 'Restaurant',
    meal_takeaway: 'Restaurant',
    health: 'Healthcare',
    secondary_school: 'Education',
    primary_school: 'Education',
    light_rail_station: 'Transportation',
    subway_station: 'Transportation',
    train_station: 'Transportation',
    amusement_park: 'Entertainment',
    shopping_mall: 'Shopping',
    department_store: 'Shopping',
    clothing_store: 'Shopping',
    supermarket: 'Shopping',
    grocery_or_supermarket: 'Shopping',
    car_wash: 'Auto',
    car_dealer: 'Auto',
    beauty_salon: 'Services',
    hair_care: 'Services',
    spa: 'Services',
    veterinary_care: 'Services',
    store: 'Shopping',
  };

  for (const type of types) {
    if (highPriorityTypes[type]) {
      return highPriorityTypes[type];
    }
  }
  
  for (const type of types) {
    if (lowPriorityTypes[type]) {
      return lowPriorityTypes[type];
    }
  }
  
  return 'Local Business';
}

export function generateMatchReasons(result: SearchResult, parsed: ParsedQuery): string[] {
  const reasons: string[] = [];
  
  if (result.source === 'curated') {
    reasons.push('Verified resource');
  }
  
  if (result.cost === 'Free') {
    reasons.push('Free');
  } else if (result.cost) {
    reasons.push(result.cost);
  }
  
  if (result.walkIn) {
    reasons.push('Walk-ins welcome');
  }
  
  if (result.languages && result.languages.length > 1) {
    reasons.push(`Multilingual (${result.languages.slice(0, 2).join(', ')})`);
  }
  
  if (result.isOpen === true) {
    reasons.push('Open now');
  }
  
  if (result.distance !== undefined && result.distance < 3) {
    reasons.push(`${result.distance.toFixed(1)} mi away`);
  }
  
  if (result.rating && result.rating >= 4.5) {
    reasons.push(`Highly rated (${result.rating.toFixed(1)})`);
  }
  
  const categoryMatch = parsed.categories.some(c => 
    result.category.toLowerCase().includes(c.toLowerCase())
  );
  if (categoryMatch) {
    reasons.push(`Matches "${result.category}"`);
  }
  
  return reasons;
}

export function rankResults(results: SearchResult[], parsed: ParsedQuery): SearchResult[] {
  return results
    .map(result => ({
      ...result,
      matchReasons: generateMatchReasons(result, parsed),
    }))
    .sort((a, b) => {
      if (a.source === 'curated' && b.source !== 'curated') return -1;
      if (b.source === 'curated' && a.source !== 'curated') return 1;
      
      const categoryMatchA = parsed.categories.some(c => 
        a.category.toLowerCase().includes(c.toLowerCase())
      ) ? 1 : 0;
      const categoryMatchB = parsed.categories.some(c => 
        b.category.toLowerCase().includes(c.toLowerCase())
      ) ? 1 : 0;
      if (categoryMatchB !== categoryMatchA) return categoryMatchB - categoryMatchA;
      
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      if (ratingB !== ratingA) return ratingB - ratingA;
      
      const reviewsA = a.reviewCount || 0;
      const reviewsB = b.reviewCount || 0;
      return reviewsB - reviewsA;
    });
}

export function groupResultsByCategory(results: SearchResult[]): GroupedResults[] {
  const groups: Map<string, SearchResult[]> = new Map();
  
  for (const result of results) {
    const category = result.category || 'Other';
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(result);
  }
  
  const sortedGroups: GroupedResults[] = [];
  
  for (const category of CATEGORY_DISPLAY_ORDER) {
    if (groups.has(category)) {
      sortedGroups.push({
        category,
        results: groups.get(category)!,
        count: groups.get(category)!.length,
      });
      groups.delete(category);
    }
  }
  
  for (const [category, results] of groups) {
    sortedGroups.push({
      category,
      results,
      count: results.length,
    });
  }
  
  return sortedGroups;
}
