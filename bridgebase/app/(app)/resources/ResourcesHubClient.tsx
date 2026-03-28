'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Share2, Loader2 } from 'lucide-react';
import { resources } from '@/data/resources';
import { HubResourceGrid } from '@/components/resources/HubResourceGrid';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { Button } from '@/components/ui/Button';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import type { FilterState } from '@/lib/types';
import {
  DEFAULT_HUB_FILTERS,
  filterHubResources,
  filtersToSearchParams,
  mergeHubFilters,
  parseHubSearchParams,
} from '@/lib/hubFilters';

export function ResourcesHubClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>(() =>
    mergeHubFilters(DEFAULT_HUB_FILTERS, parseHubSearchParams(new URLSearchParams(searchParams.toString())))
  );
  const [userGeo, setUserGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const queryString = searchParams.toString();
  useEffect(() => {
    const parsed = parseHubSearchParams(new URLSearchParams(queryString));
    setFilters(mergeHubFilters(DEFAULT_HUB_FILTERS, parsed));
  }, [queryString]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const sp = filtersToSearchParams(filters);
      const qs = sp.toString();
      const next = qs ? `${pathname}?${qs}` : pathname;
      const cur = `${pathname}${window.location.search}`;
      if (next !== cur) router.replace(next, { scroll: false });
    }, 320);
    return () => window.clearTimeout(t);
  }, [filters, pathname, router]);

  const deferredFilters = useDeferredValue(filters);

  const filtered = useMemo(
    () =>
      filterHubResources(resources, deferredFilters, {
        userLat: userGeo?.lat,
        userLng: userGeo?.lng,
      }),
    [deferredFilters, userGeo]
  );

  const onFilterChange = useCallback((patch: Partial<FilterState>) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const onClearFilters = useCallback(() => {
    setFilters(DEFAULT_HUB_FILTERS);
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Location isn’t supported in this browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      () => {
        setGeoError('Location permission denied or unavailable.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60_000 }
    );
  }, []);

  const copyShareLink = useCallback(async () => {
    const sp = filtersToSearchParams(filters);
    const qs = sp.toString();
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}${pathname}${qs ? `?${qs}` : ''}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg('Link copied');
    } catch {
      setShareMsg('Could not copy');
    }
    window.setTimeout(() => setShareMsg(null), 2000);
  }, [filters, pathname]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="clt-glass rounded-xl p-6 sm:p-8 border border-border-light">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="h-14 w-1 rounded-full bg-gradient-to-b from-accent via-gold to-primary shrink-0 mt-1" aria-hidden />
            <div className="min-w-0">
              <SectionEyebrow className="mb-3">Directory</SectionEyebrow>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight text-balance"
              >
                Community resource hub
              </motion.h1>
              <p className="text-foreground-secondary mt-3 max-w-2xl text-sm sm:text-[0.9375rem] leading-relaxed">
                Search and filter nonprofits, services, and programs. Sort by relevance, A–Z, or distance when you
                allow location. Your filters live in the URL so you can bookmark or share a list.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button variant="outline" type="button" className="w-full sm:w-auto gap-2" onClick={copyShareLink}>
              <Share2 className="w-4 h-4" />
              Copy link to this search
            </Button>
            <Button variant="accent" type="button" className="w-full sm:w-auto shadow-md" onClick={() => router.push('/request-resource')}>
              Suggest a resource →
            </Button>
          </div>
        </div>
        {shareMsg && (
          <p className="mt-4 text-xs font-medium text-accent" role="status">
            {shareMsg}
          </p>
        )}
      </div>

      <section className="clt-glass rounded-xl p-5 sm:p-7 border border-border-light space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-foreground tracking-tight">Search & filters</h2>
          {filters.sort === 'nearby' && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={requestLocation}
                disabled={geoLoading}
              >
                {geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                {userGeo ? 'Update my location' : 'Use my location for distance'}
              </Button>
              {geoError && <span className="text-xs text-foreground-muted">{geoError}</span>}
              {userGeo && !geoError && (
                <span className="text-xs text-foreground-muted">Distance sort is active.</span>
              )}
            </div>
          )}
        </div>
        <ResourceFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          resultCount={filtered.length}
        />
      </section>

      <section aria-live="polite">
        {filtered.length === 0 ? (
          <div className="clt-glass rounded-xl p-12 border border-border-light text-center space-y-4">
            <p className="font-display text-lg font-semibold text-foreground tracking-tight">No resources match</p>
            <p className="text-sm text-foreground-secondary max-w-md mx-auto leading-relaxed">
              Try clearing a filter or searching with a shorter keyword (e.g. “food”, “housing”, “health”).
            </p>
            <Button type="button" variant="accent" onClick={onClearFilters}>
              Reset all filters
            </Button>
          </div>
        ) : (
          <HubResourceGrid resources={filtered} />
        )}
      </section>
    </div>
  );
}
