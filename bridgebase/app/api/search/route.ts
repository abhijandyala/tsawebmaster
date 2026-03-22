import { NextRequest, NextResponse } from 'next/server';
import { parseQuery, buildPlacesSearchQuery } from '@/lib/queryParser';
import { searchCuratedResources, mergePlacesResults, rankResults, groupResultsByCategory, SearchResult } from '@/lib/searchService';
import { CHARLOTTE_AREA } from '@/data/resources';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  opening_hours?: { open_now?: boolean };
  photos?: { photo_reference: string }[];
}

interface PlacesApiResponse {
  status: string;
  results: PlaceResult[];
  next_page_token?: string;
  error_message?: string;
}

async function fetchPlacesPage(url: string): Promise<PlacesApiResponse> {
  const response = await fetch(url);
  return response.json();
}

async function fetchPlacesWithPagination(
  query: string,
  type: string | null,
  maxPages: number = 3
): Promise<PlaceResult[]> {
  if (!GOOGLE_PLACES_API_KEY) return [];

  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${CHARLOTTE_AREA.center.lat},${CHARLOTTE_AREA.center.lng}&radius=50000&key=${GOOGLE_PLACES_API_KEY}`;
  
  if (type) {
    url += `&type=${type}`;
  }

  const allResults: PlaceResult[] = [];
  let pageToken: string | undefined;
  let pageCount = 0;

  while (pageCount < maxPages) {
    const fetchUrl = pageToken 
      ? `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pageToken}&key=${GOOGLE_PLACES_API_KEY}`
      : url;
    
    const data = await fetchPlacesPage(fetchUrl);
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`Google Places API error:`, data.status, data.error_message);
      break;
    }

    if (data.results) {
      allResults.push(...data.results);
    }

    pageToken = data.next_page_token;
    pageCount++;

    if (!pageToken) break;
    
    // Google requires a short delay before using next_page_token
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return allResults;
}

async function searchGooglePlaces(parsed: ReturnType<typeof parseQuery>): Promise<SearchResult[]> {
  if (!GOOGLE_PLACES_API_KEY) return [];

  const baseQuery = buildPlacesSearchQuery(parsed);
  
  // For community/nonprofit searches, also search specific types
  const searchPromises: Promise<PlaceResult[]>[] = [
    fetchPlacesWithPagination(baseQuery, null, 3), // Main query - 60 results
  ];
  
  // Add specific searches for community queries
  if (parsed.queryType === 'community' || parsed.isHelpSeeking) {
    const communitySearches = [
      `${parsed.originalQuery} nonprofit Charlotte NC`,
      `${parsed.originalQuery} charity Charlotte NC`,
      `${parsed.originalQuery} community organization Charlotte NC`,
    ];
    communitySearches.forEach(q => {
      searchPromises.push(fetchPlacesWithPagination(q, null, 1));
    });
  }

  const resultsArrays = await Promise.all(searchPromises);
  const combinedResults = resultsArrays.flat();

  const seenIds = new Set<string>();
  const uniqueResults: PlaceResult[] = [];
  
  for (const place of combinedResults) {
    if (!seenIds.has(place.place_id)) {
      seenIds.add(place.place_id);
      
      const lat = place.geometry.location.lat;
      const lng = place.geometry.location.lng;
      if (
        lat >= CHARLOTTE_AREA.bounds.south &&
        lat <= CHARLOTTE_AREA.bounds.north &&
        lng >= CHARLOTTE_AREA.bounds.west &&
        lng <= CHARLOTTE_AREA.bounds.east
      ) {
        uniqueResults.push(place);
      }
    }
  }

  const mappedResults = uniqueResults.map((place) => ({
    id: place.place_id,
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address,
    location: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    },
    rating: place.rating,
    userRatingsTotal: place.user_ratings_total,
    priceLevel: place.price_level,
    types: place.types || [],
    isOpen: place.opening_hours?.open_now,
    photos: place.photos?.slice(0, 3).map((p) =>
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
    ),
  }));

  return mergePlacesResults(mappedResults);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const userLat = searchParams.get('lat');
  const userLng = searchParams.get('lng');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const parsed = parseQuery(query);
    
    const [curatedResults, placesResults] = await Promise.all([
      Promise.resolve(searchCuratedResources(parsed)),
      searchGooglePlaces(parsed),
    ]);
    
    const allResults = [...curatedResults, ...placesResults];
    const rankedResults = rankResults(allResults, parsed);
    
    if (userLat && userLng) {
      const lat = parseFloat(userLat);
      const lng = parseFloat(userLng);
      
      rankedResults.forEach(result => {
        result.distance = calculateDistance(
          lat, lng,
          result.location.lat, result.location.lng
        );
      });
    }

    const groupedResults = groupResultsByCategory(rankedResults);

    return NextResponse.json({
      query: parsed,
      results: rankedResults,
      grouped: groupedResults,
      total: rankedResults.length,
      sources: {
        curated: curatedResults.length,
        google_places: placesResults.length,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
