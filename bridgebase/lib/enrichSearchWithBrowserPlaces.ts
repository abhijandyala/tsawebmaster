import type { ParsedQuery } from '@/lib/queryParser';
import {
  rankResults,
  groupResultsByCategory,
  type SearchResult,
  type GroupedResults,
} from '@/lib/searchService';
import { searchGooglePlacesBrowser } from '@/lib/browserPlaces';

export interface SearchApiPayload {
  query: ParsedQuery;
  results: SearchResult[];
  grouped: GroupedResults[];
  total: number;
  sources: {
    curated: number;
    google_places: number;
  };
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function countCuratedLike(results: SearchResult[]): number {
  return results.filter((r) => r.source === 'curated' || r.source === 'web').length;
}

/**
 * Merges browser-side Google Places results with curated server results.
 * When NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is unset, returns the payload unchanged.
 */
export async function enrichSearchWithBrowserPlaces(
  response: SearchApiPayload,
  options: { userLat?: number; userLng?: number }
): Promise<SearchApiPayload> {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()) {
    return response;
  }

  const curated = response.results.filter((r) => r.source !== 'google_places');

  let placesResults: SearchResult[] = [];
  try {
    placesResults = await searchGooglePlacesBrowser(response.query);
  } catch (e) {
    console.error('Browser Places search failed:', e);
  }

  const allResults = [...curated, ...placesResults];
  const ranked = rankResults(allResults, response.query);

  if (options.userLat != null && options.userLng != null) {
    ranked.forEach((r) => {
      r.distance = calculateDistance(
        options.userLat!,
        options.userLng!,
        r.location.lat,
        r.location.lng
      );
    });
  }

  return {
    ...response,
    results: ranked,
    grouped: groupResultsByCategory(ranked),
    total: ranked.length,
    sources: {
      curated: countCuratedLike(curated),
      google_places: placesResults.length,
    },
  };
}
