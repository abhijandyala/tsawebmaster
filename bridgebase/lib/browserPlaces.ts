/**
 * Google Places via Maps JavaScript API (browser).
 * Works with HTTP referrer–restricted keys (e.g. Firebase "browser" keys).
 * Server-side REST calls do not send a valid referrer and often fail for those keys.
 */

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { CHARLOTTE_AREA } from '@/data/resources';
import { buildPlacesSearchQuery } from '@/lib/queryParser';
import type { ParsedQuery } from '@/lib/queryParser';
import { mergePlacesResults, type SearchResult } from '@/lib/searchService';

let mapsKeyConfigured = false;
let placesServicePromise: Promise<google.maps.places.PlacesService> | null = null;

function ensureMapsApiKey(): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key) {
    throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set');
  }
  if (!mapsKeyConfigured) {
    setOptions({ key });
    mapsKeyConfigured = true;
  }
  return key;
}

async function getPlacesService(): Promise<google.maps.places.PlacesService> {
  ensureMapsApiKey();
  if (!placesServicePromise) {
    placesServicePromise = (async () => {
      await importLibrary('maps');
      await importLibrary('places');
      const div = document.createElement('div');
      div.setAttribute('aria-hidden', 'true');
      div.style.cssText =
        'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1;overflow:hidden;';
      document.body.appendChild(div);
      const map = new google.maps.Map(div, {
        center: CHARLOTTE_AREA.center,
        zoom: 12,
        disableDefaultUI: true,
      });
      return new google.maps.places.PlacesService(map);
    })();
  }
  return placesServicePromise;
}

const MAX_TEXT_RESULTS = 60;

function textSearchPaginated(
  service: google.maps.places.PlacesService,
  request: google.maps.places.TextSearchRequest
): Promise<google.maps.places.PlaceResult[]> {
  const acc: google.maps.places.PlaceResult[] = [];

  return new Promise((resolve) => {
    service.textSearch(request, function callback(
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus,
      pagination: google.maps.places.PlaceSearchPagination | null
    ) {
      const ok = google.maps.places.PlacesServiceStatus.OK;
      const zero = google.maps.places.PlacesServiceStatus.ZERO_RESULTS;

      if (status !== ok && status !== zero) {
        resolve(acc.length > 0 ? acc : []);
        return;
      }

      if (results?.length) {
        acc.push(...results);
      }

      if (acc.length >= MAX_TEXT_RESULTS) {
        resolve(acc.slice(0, MAX_TEXT_RESULTS));
        return;
      }

      if (pagination?.hasNextPage) {
        pagination.nextPage();
      } else {
        resolve(acc);
      }
    });
  });
}

function mapJsPlaceToMergeInput(place: google.maps.places.PlaceResult): {
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
} | null {
  if (!place.place_id || !place.name || !place.formatted_address) return null;
  const loc = place.geometry?.location;
  if (!loc) return null;

  const photos =
    place.photos?.slice(0, 3).map((p) => p.getUrl({ maxWidth: 400 })) ?? [];

  let isOpen: boolean | undefined;
  try {
    isOpen = place.opening_hours?.isOpen?.();
  } catch {
    isOpen = undefined;
  }

  return {
    id: place.place_id,
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address,
    location: { lat: loc.lat(), lng: loc.lng() },
    rating: place.rating,
    userRatingsTotal: place.user_ratings_total,
    priceLevel: place.price_level,
    types: place.types ?? [],
    isOpen,
    photos: photos.length ? photos : undefined,
  };
}

function dedupeAndFilterBounds(
  places: google.maps.places.PlaceResult[]
): google.maps.places.PlaceResult[] {
  const seen = new Set<string>();
  const out: google.maps.places.PlaceResult[] = [];

  for (const place of places) {
    if (!place.place_id) continue;
    if (seen.has(place.place_id)) continue;
    const loc = place.geometry?.location;
    if (!loc) continue;
    const lat = loc.lat();
    const lng = loc.lng();
    if (
      lat < CHARLOTTE_AREA.bounds.south ||
      lat > CHARLOTTE_AREA.bounds.north ||
      lng < CHARLOTTE_AREA.bounds.west ||
      lng > CHARLOTTE_AREA.bounds.east
    ) {
      continue;
    }
    seen.add(place.place_id);
    out.push(place);
  }
  return out;
}

export async function searchGooglePlacesBrowser(parsed: ParsedQuery): Promise<SearchResult[]> {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()) {
    return [];
  }

  const service = await getPlacesService();
  const location = new google.maps.LatLng(CHARLOTTE_AREA.center.lat, CHARLOTTE_AREA.center.lng);

  const mkRequest = (q: string): google.maps.places.TextSearchRequest => ({
    query: q,
    location,
    radius: 50000,
  });

  const baseQuery = buildPlacesSearchQuery(parsed);
  const tasks: Promise<google.maps.places.PlaceResult[]>[] = [
    textSearchPaginated(service, mkRequest(baseQuery)),
  ];

  if (parsed.queryType === 'community' || parsed.isHelpSeeking) {
    const extra = [
      `${parsed.originalQuery} nonprofit Charlotte NC`,
      `${parsed.originalQuery} charity Charlotte NC`,
      `${parsed.originalQuery} community organization Charlotte NC`,
    ];
    extra.forEach((q) => tasks.push(textSearchPaginated(service, mkRequest(q))));
  }

  const chunks = await Promise.all(tasks);
  const merged = dedupeAndFilterBounds(chunks.flat());

  const mapped = merged
    .map(mapJsPlaceToMergeInput)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return mergePlacesResults(mapped);
}

export interface BrowserPlaceDetails {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  location: { lat: number; lng: number };
  hours?: string[];
  isOpen?: boolean;
  reviews: Array<{
    authorName: string;
    rating: number;
    text: string;
    time: number;
    relativeTime: string;
  }>;
  types: string[];
  photos: string[];
}

export async function fetchPlaceDetailsBrowser(
  placeId: string
): Promise<BrowserPlaceDetails | null> {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()) {
    return null;
  }

  const service = await getPlacesService();

  const fields: string[] = [
    'place_id',
    'name',
    'formatted_address',
    'formatted_phone_number',
    'website',
    'rating',
    'user_ratings_total',
    'price_level',
    'geometry',
    'opening_hours',
    'reviews',
    'types',
    'photos',
  ];

  return new Promise((resolve) => {
    service.getDetails({ placeId, fields }, (place, status) => {
      const ok = google.maps.places.PlacesServiceStatus.OK;
      if (status !== ok || !place || !place.place_id || !place.name) {
        resolve(null);
        return;
      }

      const loc = place.geometry?.location;
      if (!loc) {
        resolve(null);
        return;
      }

      let isOpen: boolean | undefined;
      try {
        isOpen = place.opening_hours?.isOpen?.();
      } catch {
        isOpen = undefined;
      }

      const photos =
        place.photos?.slice(0, 8).map((p) => p.getUrl({ maxWidth: 800 })) ?? [];

      const reviews = (place.reviews ?? []).map((r) => ({
        authorName: r.author_name ?? 'Anonymous',
        rating: r.rating ?? 0,
        text: r.text ?? '',
        time: typeof r.time === 'number' ? r.time : 0,
        relativeTime: r.relative_time_description ?? '',
      }));

      resolve({
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address ?? '',
        phone: place.formatted_phone_number,
        website: place.website,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        location: { lat: loc.lat(), lng: loc.lng() },
        hours: place.opening_hours?.weekday_text,
        isOpen,
        reviews,
        types: place.types ?? [],
        photos,
      });
    });
  });
}
