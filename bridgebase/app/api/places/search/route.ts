import { NextRequest, NextResponse } from 'next/server';
import { CHARLOTTE_AREA } from '@/data/resources';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export interface PlaceResult {
  id: string;
  placeId: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  types: string[];
  isOpen?: boolean;
  photos?: string[];
  phone?: string;
  website?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const type = searchParams.get('type');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ error: 'Google Maps API key not configured' }, { status: 500 });
  }

  try {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${CHARLOTTE_AREA.center.lat},${CHARLOTTE_AREA.center.lng}&radius=50000&key=${GOOGLE_PLACES_API_KEY}`;
    
    if (type) {
      url += `&type=${type}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      return NextResponse.json({ 
        error: 'Failed to search places', 
        details: data.error_message 
      }, { status: 500 });
    }

    const results: PlaceResult[] = (data.results || []).map((place: {
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
    }) => ({
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
      types: place.types,
      isOpen: place.opening_hours?.open_now,
      photos: place.photos?.slice(0, 3).map((p: { photo_reference: string }) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      ),
    }));

    const filteredResults = results.filter((place) => {
      const lat = place.location.lat;
      const lng = place.location.lng;
      return (
        lat >= CHARLOTTE_AREA.bounds.south &&
        lat <= CHARLOTTE_AREA.bounds.north &&
        lng >= CHARLOTTE_AREA.bounds.west &&
        lng <= CHARLOTTE_AREA.bounds.east
      );
    });

    return NextResponse.json({
      results: filteredResults,
      total: filteredResults.length,
    });
  } catch (error) {
    console.error('Error searching places:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
