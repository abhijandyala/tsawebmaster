import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  location: {
    lat: number;
    lng: number;
  };
  hours?: string[];
  isOpen?: boolean;
  reviews: Review[];
  types: string[];
  photos: string[];
}

export interface Review {
  authorName: string;
  rating: number;
  text: string;
  time: number;
  relativeTime: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ error: 'placeId parameter is required' }, { status: 400 });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ error: 'Google Maps API key not configured' }, { status: 500 });
  }

  try {
    const fields = [
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
    ].join(',');

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Places Details API error:', data.status, data.error_message);
      return NextResponse.json({ 
        error: 'Failed to get place details', 
        details: data.error_message 
      }, { status: 500 });
    }

    const place = data.result;

    const details: PlaceDetails = {
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      priceLevel: place.price_level,
      location: {
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng,
      },
      hours: place.opening_hours?.weekday_text,
      isOpen: place.opening_hours?.open_now,
      reviews: (place.reviews || []).map((review: {
        author_name: string;
        rating: number;
        text: string;
        time: number;
        relative_time_description: string;
      }) => ({
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time,
        relativeTime: review.relative_time_description,
      })),
      types: place.types || [],
      photos: (place.photos || []).slice(0, 5).map((p: { photo_reference: string }) =>
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      ),
    };

    return NextResponse.json(details);
  } catch (error) {
    console.error('Error getting place details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
