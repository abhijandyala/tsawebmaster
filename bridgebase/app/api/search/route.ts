import { NextRequest, NextResponse } from 'next/server';
import { parseQuery } from '@/lib/queryParser';
import { searchCuratedResources, rankResults, groupResultsByCategory } from '@/lib/searchService';

/**
 * Curated results only. Google Places runs in the browser (see enrichSearchWithBrowserPlaces)
 * so HTTP referrer–restricted keys (e.g. Firebase browser keys) work.
 */
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
    const curatedResults = searchCuratedResources(parsed);
    const rankedResults = rankResults(curatedResults, parsed);

    if (userLat && userLng) {
      const lat = parseFloat(userLat);
      const lng = parseFloat(userLng);

      rankedResults.forEach((result) => {
        result.distance = calculateDistance(lat, lng, result.location.lat, result.location.lng);
      });
    }

    const groupedResults = groupResultsByCategory(rankedResults);

    return NextResponse.json({
      query: parsed,
      results: rankedResults,
      grouped: groupedResults,
      total: rankedResults.length,
      sources: {
        curated: curatedResults.filter((r) => r.source === 'curated' || r.source === 'web').length,
        google_places: 0,
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
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
