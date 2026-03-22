import { CHARLOTTE_AREA } from '@/data/resources';

export interface ParsedQuery {
  intent: 'find_place' | 'find_service' | 'get_info' | 'general';
  queryType: 'commercial' | 'community' | 'mixed';
  categories: string[];
  attributes: string[];
  location?: string;
  placeTypes: string[];
  originalQuery: string;
  searchTerms: string[];
  isHelpSeeking: boolean;
}

const CATEGORY_MAPPINGS: Record<string, { categories: string[]; placeTypes: string[]; isCommercial: boolean }> = {
  food: { categories: ['Food', 'Restaurant'], placeTypes: ['restaurant', 'food', 'meal_delivery', 'meal_takeaway', 'cafe', 'bakery'], isCommercial: true },
  restaurant: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  restaurants: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  sushi: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  pizza: { categories: ['Restaurant'], placeTypes: ['restaurant', 'meal_delivery'], isCommercial: true },
  burger: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  tacos: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  mexican: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  chinese: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  italian: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  thai: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  indian: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  bbq: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  barbecue: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  breakfast: { categories: ['Restaurant'], placeTypes: ['restaurant', 'cafe'], isCommercial: true },
  brunch: { categories: ['Restaurant'], placeTypes: ['restaurant', 'cafe'], isCommercial: true },
  lunch: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  dinner: { categories: ['Restaurant'], placeTypes: ['restaurant'], isCommercial: true },
  coffee: { categories: ['Cafe'], placeTypes: ['cafe'], isCommercial: true },
  cafe: { categories: ['Cafe'], placeTypes: ['cafe'], isCommercial: true },
  bar: { categories: ['Nightlife'], placeTypes: ['bar', 'night_club'], isCommercial: true },
  drinks: { categories: ['Nightlife'], placeTypes: ['bar'], isCommercial: true },
  brewery: { categories: ['Nightlife'], placeTypes: ['bar'], isCommercial: true },
  
  grocery: { categories: ['Shopping'], placeTypes: ['grocery_or_supermarket', 'supermarket'], isCommercial: true },
  groceries: { categories: ['Shopping'], placeTypes: ['grocery_or_supermarket', 'supermarket'], isCommercial: true },
  shopping: { categories: ['Shopping'], placeTypes: ['shopping_mall', 'department_store', 'clothing_store'], isCommercial: true },
  mall: { categories: ['Shopping'], placeTypes: ['shopping_mall'], isCommercial: true },
  store: { categories: ['Shopping'], placeTypes: ['store', 'department_store'], isCommercial: true },
  
  gym: { categories: ['Fitness'], placeTypes: ['gym'], isCommercial: true },
  fitness: { categories: ['Fitness'], placeTypes: ['gym'], isCommercial: true },
  yoga: { categories: ['Fitness'], placeTypes: ['gym'], isCommercial: true },
  
  park: { categories: ['Recreation'], placeTypes: ['park'], isCommercial: false },
  parks: { categories: ['Recreation'], placeTypes: ['park'], isCommercial: false },
  hiking: { categories: ['Recreation'], placeTypes: ['park'], isCommercial: false },
  
  hotel: { categories: ['Lodging'], placeTypes: ['lodging', 'hotel'], isCommercial: true },
  hotels: { categories: ['Lodging'], placeTypes: ['lodging', 'hotel'], isCommercial: true },
  
  'food bank': { categories: ['Food Assistance'], placeTypes: ['food'], isCommercial: false },
  'food pantry': { categories: ['Food Assistance'], placeTypes: ['food'], isCommercial: false },
  pantry: { categories: ['Food Assistance'], placeTypes: ['food'], isCommercial: false },
  hungry: { categories: ['Food Assistance'], placeTypes: [], isCommercial: false },
  'free food': { categories: ['Food Assistance'], placeTypes: [], isCommercial: false },
  'meal program': { categories: ['Food Assistance'], placeTypes: [], isCommercial: false },
  
  housing: { categories: ['Housing'], placeTypes: ['real_estate_agency'], isCommercial: false },
  shelter: { categories: ['Housing', 'Emergency Help'], placeTypes: ['lodging'], isCommercial: false },
  homeless: { categories: ['Housing', 'Emergency Help'], placeTypes: [], isCommercial: false },
  apartment: { categories: ['Housing'], placeTypes: ['real_estate_agency'], isCommercial: true },
  rent: { categories: ['Housing'], placeTypes: ['real_estate_agency'], isCommercial: false },
  'rent assistance': { categories: ['Housing'], placeTypes: [], isCommercial: false },
  'housing assistance': { categories: ['Housing'], placeTypes: [], isCommercial: false },
  eviction: { categories: ['Housing', 'Legal'], placeTypes: [], isCommercial: false },
  
  doctor: { categories: ['Healthcare'], placeTypes: ['doctor', 'hospital', 'health'], isCommercial: true },
  doctors: { categories: ['Healthcare'], placeTypes: ['doctor', 'hospital', 'health'], isCommercial: true },
  clinic: { categories: ['Healthcare'], placeTypes: ['doctor', 'hospital', 'health'], isCommercial: true },
  clinics: { categories: ['Healthcare'], placeTypes: ['doctor', 'hospital', 'health'], isCommercial: true },
  hospital: { categories: ['Healthcare'], placeTypes: ['hospital'], isCommercial: true },
  hospitals: { categories: ['Healthcare'], placeTypes: ['hospital'], isCommercial: true },
  dentist: { categories: ['Healthcare'], placeTypes: ['dentist'], isCommercial: true },
  dentists: { categories: ['Healthcare'], placeTypes: ['dentist'], isCommercial: true },
  pharmacy: { categories: ['Healthcare'], placeTypes: ['pharmacy', 'drugstore'], isCommercial: true },
  pharmacies: { categories: ['Healthcare'], placeTypes: ['pharmacy', 'drugstore'], isCommercial: true },
  health: { categories: ['Healthcare'], placeTypes: ['health', 'doctor'], isCommercial: true },
  healthcare: { categories: ['Healthcare'], placeTypes: ['health', 'doctor'], isCommercial: true },
  'free clinic': { categories: ['Healthcare'], placeTypes: ['doctor', 'health'], isCommercial: false },
  'no insurance': { categories: ['Healthcare'], placeTypes: [], isCommercial: false },
  uninsured: { categories: ['Healthcare'], placeTypes: [], isCommercial: false },
  
  therapy: { categories: ['Mental Health'], placeTypes: ['health'], isCommercial: true },
  counseling: { categories: ['Mental Health'], placeTypes: ['health'], isCommercial: false },
  'mental health': { categories: ['Mental Health'], placeTypes: ['health'], isCommercial: false },
  psychologist: { categories: ['Mental Health'], placeTypes: ['health'], isCommercial: true },
  depression: { categories: ['Mental Health'], placeTypes: [], isCommercial: false },
  anxiety: { categories: ['Mental Health'], placeTypes: [], isCommercial: false },
  'crisis line': { categories: ['Mental Health', 'Emergency Help'], placeTypes: [], isCommercial: false },
  suicide: { categories: ['Mental Health', 'Emergency Help'], placeTypes: [], isCommercial: false },
  
  school: { categories: ['Education'], placeTypes: ['school', 'university', 'secondary_school', 'primary_school'], isCommercial: true },
  schools: { categories: ['Education'], placeTypes: ['school', 'university', 'secondary_school', 'primary_school'], isCommercial: true },
  tutor: { categories: ['Education'], placeTypes: ['school'], isCommercial: true },
  tutoring: { categories: ['Education'], placeTypes: ['school'], isCommercial: true },
  library: { categories: ['Education'], placeTypes: ['library'], isCommercial: true },
  education: { categories: ['Education'], placeTypes: ['school', 'library'], isCommercial: true },
  ged: { categories: ['Education'], placeTypes: ['school'], isCommercial: false },
  'adult education': { categories: ['Education'], placeTypes: ['school'], isCommercial: false },
  college: { categories: ['Education'], placeTypes: ['university'], isCommercial: true },
  university: { categories: ['Education'], placeTypes: ['university'], isCommercial: true },
  
  job: { categories: ['Jobs'], placeTypes: ['employment_agency'], isCommercial: false },
  jobs: { categories: ['Jobs'], placeTypes: ['employment_agency'], isCommercial: false },
  career: { categories: ['Jobs'], placeTypes: ['employment_agency'], isCommercial: false },
  employment: { categories: ['Jobs'], placeTypes: ['employment_agency'], isCommercial: false },
  work: { categories: ['Jobs'], placeTypes: ['employment_agency'], isCommercial: false },
  hiring: { categories: ['Jobs'], placeTypes: ['employment_agency'], isCommercial: false },
  'job training': { categories: ['Jobs'], placeTypes: [], isCommercial: false },
  unemployment: { categories: ['Jobs'], placeTypes: [], isCommercial: false },
  
  bus: { categories: ['Transportation'], placeTypes: ['bus_station', 'transit_station'], isCommercial: true },
  transit: { categories: ['Transportation'], placeTypes: ['transit_station'], isCommercial: true },
  cats: { categories: ['Transportation'], placeTypes: ['transit_station', 'bus_station'], isCommercial: true },
  'light rail': { categories: ['Transportation'], placeTypes: ['light_rail_station', 'transit_station'], isCommercial: true },
  ride: { categories: ['Transportation'], placeTypes: ['taxi_stand'], isCommercial: false },
  transportation: { categories: ['Transportation'], placeTypes: ['transit_station'], isCommercial: false },
  
  youth: { categories: ['Youth Programs'], placeTypes: ['school'], isCommercial: false },
  kids: { categories: ['Youth Programs'], placeTypes: ['school'], isCommercial: true },
  children: { categories: ['Youth Programs'], placeTypes: ['school'], isCommercial: true },
  'after school': { categories: ['Youth Programs'], placeTypes: ['school'], isCommercial: false },
  daycare: { categories: ['Youth Programs'], placeTypes: ['school'], isCommercial: true },
  childcare: { categories: ['Youth Programs'], placeTypes: ['school'], isCommercial: true },
  
  emergency: { categories: ['Emergency Help'], placeTypes: ['hospital', 'police', 'fire_station'], isCommercial: false },
  crisis: { categories: ['Emergency Help'], placeTypes: ['hospital'], isCommercial: false },
  help: { categories: ['Community Services'], placeTypes: [], isCommercial: false },
  assistance: { categories: ['Community Services'], placeTypes: [], isCommercial: false },
  
  nonprofit: { categories: ['Community Services'], placeTypes: ['local_government_office', 'church'], isCommercial: false },
  'non profit': { categories: ['Community Services'], placeTypes: ['local_government_office', 'church'], isCommercial: false },
  charity: { categories: ['Community Services'], placeTypes: ['church'], isCommercial: false },
  volunteer: { categories: ['Community Services'], placeTypes: ['local_government_office'], isCommercial: false },
  church: { categories: ['Community Services'], placeTypes: ['church'], isCommercial: false },
  
  lawyer: { categories: ['Legal'], placeTypes: ['lawyer'], isCommercial: true },
  lawyers: { categories: ['Legal'], placeTypes: ['lawyer'], isCommercial: true },
  attorney: { categories: ['Legal'], placeTypes: ['lawyer'], isCommercial: true },
  attorneys: { categories: ['Legal'], placeTypes: ['lawyer'], isCommercial: true },
  'legal aid': { categories: ['Legal'], placeTypes: ['lawyer'], isCommercial: false },
  'legal help': { categories: ['Legal'], placeTypes: ['lawyer'], isCommercial: false },
  
  bank: { categories: ['Financial'], placeTypes: ['bank'], isCommercial: true },
  banks: { categories: ['Financial'], placeTypes: ['bank'], isCommercial: true },
  atm: { categories: ['Financial'], placeTypes: ['atm'], isCommercial: true },
  atms: { categories: ['Financial'], placeTypes: ['atm'], isCommercial: true },
  'credit union': { categories: ['Financial'], placeTypes: ['bank'], isCommercial: true },
  'financial assistance': { categories: ['Financial'], placeTypes: [], isCommercial: false },
  bills: { categories: ['Financial'], placeTypes: [], isCommercial: false },
  utilities: { categories: ['Financial'], placeTypes: [], isCommercial: false },
  
  gas: { categories: ['Auto'], placeTypes: ['gas_station'], isCommercial: true },
  'gas station': { categories: ['Auto'], placeTypes: ['gas_station'], isCommercial: true },
  mechanic: { categories: ['Auto'], placeTypes: ['car_repair'], isCommercial: true },
  'car repair': { categories: ['Auto'], placeTypes: ['car_repair'], isCommercial: true },
  
  salon: { categories: ['Services'], placeTypes: ['beauty_salon', 'hair_care'], isCommercial: true },
  haircut: { categories: ['Services'], placeTypes: ['hair_care'], isCommercial: true },
  spa: { categories: ['Services'], placeTypes: ['spa'], isCommercial: true },
  
  museum: { categories: ['Entertainment'], placeTypes: ['museum'], isCommercial: true },
  movies: { categories: ['Entertainment'], placeTypes: ['movie_theater'], isCommercial: true },
  theater: { categories: ['Entertainment'], placeTypes: ['movie_theater'], isCommercial: true },
  entertainment: { categories: ['Entertainment'], placeTypes: ['amusement_park', 'movie_theater', 'bowling_alley'], isCommercial: true },
};

const HELP_SEEKING_PHRASES = [
  'i need', 'help me', 'struggling', 'cant afford', "can't afford", 'no money',
  'lost my', 'kicked out', 'nowhere to go', 'desperate', 'emergency',
  'free', 'low cost', 'low-cost', 'sliding scale', 'no insurance',
  'assistance', 'resources', 'support', 'aid',
];

const LOCATION_KEYWORDS = [
  'near me',
  'nearby',
  'close by',
  'around here',
  'in my area',
  ...CHARLOTTE_AREA.regions.map(r => r.toLowerCase()),
];

const INTENT_KEYWORDS = {
  find_place: ['find', 'where', 'looking for', 'search', 'show me', 'get', 'need', 'want'],
  find_service: ['help with', 'assistance', 'support', 'service', 'program'],
  get_info: ['what is', 'how to', 'tell me about', 'information', 'learn about'],
};

const ATTRIBUTE_KEYWORDS = [
  'free', 'cheap', 'affordable', 'low-cost', 'budget',
  'open now', 'open late', '24 hour', '24/7',
  'good', 'best', 'top', 'rated', 'popular', 'famous',
  'spicy', 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free',
  'family', 'kids', 'seniors', 'adults', 'pet-friendly',
  'emergency', 'urgent', 'quick', 'walk-in',
  'outdoor', 'indoor', 'rooftop', 'patio',
];

export function parseQuery(query: string): ParsedQuery {
  const lowerQuery = query.toLowerCase().trim();
  const words = lowerQuery.split(/\s+/);
  
  let intent: ParsedQuery['intent'] = 'general';
  for (const [intentType, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      intent = intentType as ParsedQuery['intent'];
      break;
    }
  }
  
  const isHelpSeeking = HELP_SEEKING_PHRASES.some(phrase => lowerQuery.includes(phrase));
  
  const categories: Set<string> = new Set();
  const placeTypes: Set<string> = new Set();
  const searchTerms: string[] = [];
  let hasCommercial = false;
  let hasCommunity = false;
  
  const sortedKeywords = Object.entries(CATEGORY_MAPPINGS)
    .sort((a, b) => b[0].length - a[0].length);
  
  const matchedRanges: Array<[number, number]> = [];
  
  const isRangeOverlapping = (start: number, end: number): boolean => {
    return matchedRanges.some(([s, e]) => !(end <= s || start >= e));
  };
  
  for (const [keyword, mapping] of sortedKeywords) {
    const keywordRegex = keyword.includes(' ')
      ? new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      : new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    
    let match;
    while ((match = keywordRegex.exec(lowerQuery)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      
      if (!isRangeOverlapping(start, end)) {
        matchedRanges.push([start, end]);
        mapping.categories.forEach(c => categories.add(c));
        mapping.placeTypes.forEach(t => placeTypes.add(t));
        if (!searchTerms.includes(keyword)) {
          searchTerms.push(keyword);
        }
        if (mapping.isCommercial) hasCommercial = true;
        else hasCommunity = true;
      }
    }
  }
  
  let queryType: ParsedQuery['queryType'] = 'mixed';
  if (isHelpSeeking) {
    queryType = 'community';
  } else if (hasCommercial && !hasCommunity) {
    queryType = 'commercial';
  } else if (hasCommunity && !hasCommercial) {
    queryType = 'community';
  }
  
  const attributes = ATTRIBUTE_KEYWORDS.filter(attr => lowerQuery.includes(attr));
  
  let location: string | undefined;
  for (const locKeyword of LOCATION_KEYWORDS) {
    if (lowerQuery.includes(locKeyword)) {
      location = locKeyword;
      break;
    }
  }
  
  if (categories.size === 0) {
    words.forEach(word => {
      if (word.length > 2 && !['the', 'and', 'for', 'with', 'near', 'find', 'get', 'show', 'me'].includes(word)) {
        searchTerms.push(word);
      }
    });
  }

  return {
    intent,
    queryType,
    categories: Array.from(categories),
    attributes,
    location,
    placeTypes: Array.from(placeTypes),
    originalQuery: query,
    searchTerms: searchTerms.length > 0 ? searchTerms : words.filter(w => w.length > 2),
    isHelpSeeking,
  };
}

export function buildPlacesSearchQuery(parsed: ParsedQuery): string {
  let searchQuery = parsed.originalQuery;
  
  if (!parsed.location || parsed.location === 'near me' || parsed.location === 'nearby') {
    searchQuery += ' Charlotte NC';
  }
  
  return searchQuery;
}

export function getSearchTypes(parsed: ParsedQuery): string[] {
  if (parsed.placeTypes.length > 0) {
    return parsed.placeTypes;
  }
  
  return [];
}
