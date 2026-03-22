'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { CHARLOTTE_AREA } from '@/data/resources';

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  description?: string;
  category?: string;
  isOpen?: boolean;
}

interface GoogleMapProps {
  markers?: MapMarker[];
  selectedMarkerId?: string | null;
  onMarkerClick?: (markerId: string) => void;
  height?: string;
  showUserLocation?: boolean;
  autoFitBounds?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
}

let apiConfigured = false;

export function GoogleMap({
  markers = [],
  selectedMarkerId,
  onMarkerClick,
  height = '400px',
  showUserLocation = true,
  autoFitBounds = false,
  center,
  zoom,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const lastMarkerCountRef = useRef<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initMap = useCallback(async () => {
    if (!mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    try {
      if (!apiConfigured) {
        setOptions({ key: apiKey });
        apiConfigured = true;
      }

      await importLibrary('maps');
      await importLibrary('places');

      const charlotteBounds = new google.maps.LatLngBounds(
        { lat: CHARLOTTE_AREA.bounds.south, lng: CHARLOTTE_AREA.bounds.west },
        { lat: CHARLOTTE_AREA.bounds.north, lng: CHARLOTTE_AREA.bounds.east }
      );

      const map = new google.maps.Map(mapRef.current, {
        center: center || CHARLOTTE_AREA.center,
        zoom: zoom || 12,
        restriction: {
          latLngBounds: charlotteBounds,
          strictBounds: false,
        },
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      mapInstanceRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();

      if (showUserLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            if (charlotteBounds.contains(userPos)) {
              new google.maps.Marker({
                map,
                position: userPos,
                title: 'Your Location',
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 3,
                },
              });
            }
          },
          () => {},
          { enableHighAccuracy: true }
        );
      }

      setIsLoaded(true);
    } catch (err) {
      console.error('Error loading Google Maps:', err);
      setError('Failed to load Google Maps');
    }
  }, [showUserLocation, center, zoom]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const existingMarkers = markersRef.current;

    existingMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    existingMarkers.clear();

    markers.forEach((markerData) => {
      const isSelected = markerData.id === selectedMarkerId;
      
      const marker = new google.maps.Marker({
        map,
        position: markerData.position,
        title: markerData.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 12 : 10,
          fillColor: markerData.isOpen !== false ? '#23361D' : '#447CB3',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="max-width: 200px; padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${markerData.title}</h3>
              ${markerData.category ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${markerData.category}</p>` : ''}
              ${markerData.description ? `<p style="margin: 0; font-size: 12px;">${markerData.description.slice(0, 100)}...</p>` : ''}
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
        onMarkerClick?.(markerData.id);
      });

      existingMarkers.set(markerData.id, marker);
    });

    if (autoFitBounds && markers.length > 0 && markers.length !== lastMarkerCountRef.current) {
      lastMarkerCountRef.current = markers.length;
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend(m.position));
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      
      const listener = map.addListener('idle', () => {
        const zoom = map.getZoom();
        if (zoom && zoom > 15) {
          map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [markers, selectedMarkerId, isLoaded, onMarkerClick, autoFitBounds]);

  if (error) {
    return (
      <div 
        style={{ height }} 
        className="bg-background-alt flex items-center justify-center text-foreground-muted"
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-background-alt flex items-center justify-center">
          <div className="animate-pulse text-foreground-muted">Loading map...</div>
        </div>
      )}
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
