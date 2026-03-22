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
    <div className="rounded-3xl border-2 border-accent/25 bg-surface-muted/50 p-1 shadow-lg overflow-hidden h-[420px] w-full ring-1 ring-accent/10">
      <div className="h-full w-full rounded-[1.35rem] overflow-hidden border border-border-light">
        <GoogleMap
          markers={markers}
          height="100%"
          showUserLocation
          autoFitBounds
          onMarkerClick={(id) => router.push(`/resource/${id}`)}
        />
      </div>
    </div>
  );
}
