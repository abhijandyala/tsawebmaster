'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, type MapMarker } from '@/components/maps/GoogleMap';
import { resources } from '@/data/resources';

export function GlobalResourcesMap() {
  const router = useRouter();
  const markers: MapMarker[] = useMemo(
    () =>
      resources
        .filter((r) => r.coordinates)
        .map((r) => ({
          id: r.id,
          position: r.coordinates!,
          title: r.name,
          description: r.category,
        })),
    []
  );

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-surface h-[420px] w-full">
      <GoogleMap
        markers={markers}
        height="100%"
        showUserLocation
        autoFitBounds
        onMarkerClick={(id) => router.push(`/resource/${id}`)}
      />
    </div>
  );
}
