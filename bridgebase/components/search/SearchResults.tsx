'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { SearchResultCard } from './SearchResultCard';
import { ResultSection } from './ResultSection';
import { QuickFilters, FilterState } from './QuickFilters';
import { GoogleMap, MapMarker } from '@/components/maps/GoogleMap';
import { CrisisBanner } from '@/components/ui/CrisisBanner';
import { SearchResult, GroupedResults, groupResultsByCategory } from '@/lib/searchService';
import { enrichSearchWithBrowserPlaces } from '@/lib/enrichSearchWithBrowserPlaces';
import { Loader2, MapIcon, List, LayoutGrid, LayoutList, Scale, X } from 'lucide-react';
import { CompareModal } from './CompareModal';
import { ParsedQuery } from '@/lib/queryParser';

interface SearchResultsProps {
  query: string;
  userLocation?: { lat: number; lng: number };
  onClearSearch?: () => void;
}

interface SearchApiResponse {
  query: ParsedQuery;
  results: SearchResult[];
  grouped: GroupedResults[];
  total: number;
  sources: {
    curated: number;
    google_places: number;
  };
}

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'crisis', 'emergency', 'homeless', 'kicked out', 'nowhere to go',
  'domestic violence', 'abuse', 'hurt', 'danger', 'unsafe',
];

const fetcher = async (url: string): Promise<SearchApiResponse> => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to search');
  }
  return data;
};

export function SearchResults({ query, userLocation: initialLocation, onClearSearch }: SearchResultsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');
  const [userLocation, setUserLocation] = useState(initialLocation);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    openNow: false,
    freeOnly: false,
    highlyRated: false,
    nearMe: false,
    sortBy: 'relevance',
  });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsRequestingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMountedRef.current) return;
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setFilters(prev => ({ ...prev, nearMe: true }));
        setIsRequestingLocation(false);
      },
      (error) => {
        if (!isMountedRef.current) return;
        setIsRequestingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Please allow location access to use the "Near Me" feature. Check your browser settings.');
        } else {
          alert('Unable to get your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const searchUrl = useMemo(() => {
    if (!query.trim()) return null;
    let url = `/api/search?q=${encodeURIComponent(query)}`;
    if (userLocation) {
      url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
    }
    return url;
  }, [query, userLocation]);

  const { data: swrData, error, isLoading, mutate } = useSWR<SearchApiResponse>(
    searchUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      keepPreviousData: false,
    }
  );

  const [displayData, setDisplayData] = useState<SearchApiResponse | null>(null);

  useEffect(() => {
    if (!swrData) {
      setDisplayData(null);
      return;
    }
    setDisplayData(swrData);
    let cancelled = false;
    void enrichSearchWithBrowserPlaces(swrData, {
      userLat: userLocation?.lat,
      userLng: userLocation?.lng,
    })
      .then((enriched) => {
        if (!cancelled) setDisplayData(enriched);
      })
      .catch(() => {
        if (!cancelled) setDisplayData(swrData);
      });
    return () => {
      cancelled = true;
    };
  }, [swrData, userLocation?.lat, userLocation?.lng]);

  const filteredResults = useMemo(() => {
    if (!displayData?.results) return [];
    
    let results = [...displayData.results];
    
    if (filters.openNow) {
      results = results.filter(r => r.isOpen === true);
    }
    if (filters.freeOnly) {
      results = results.filter(r => r.cost === 'Free' || r.priceLevel === 0);
    }
    if (filters.highlyRated) {
      results = results.filter(r => (r.rating || 0) >= 4);
    }
    if (filters.nearMe && userLocation) {
      results = results.filter(r => (r.distance || Infinity) <= 5);
    }
    
    switch (filters.sortBy) {
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'distance':
        results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        break;
      case 'reviews':
        results.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }
    
    return results;
  }, [displayData, filters, userLocation]);

  const filteredGrouped = useMemo(() => {
    if (!filteredResults.length) return [];
    return groupResultsByCategory(filteredResults);
  }, [filteredResults]);

  const showCrisisBanner = useMemo(() => {
    if (!displayData?.query) return false;
    const lowerQuery = query.toLowerCase();
    const isCrisisQuery = CRISIS_KEYWORDS.some(kw => lowerQuery.includes(kw));
    return displayData.query.isHelpSeeking || isCrisisQuery;
  }, [displayData, query]);

  const isSevereCrisis = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    const severeKeywords = ['suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'domestic violence', 'abuse'];
    return severeKeywords.some(kw => lowerQuery.includes(kw));
  }, [query]);

  const compareResources = useMemo(() => {
    return filteredResults.filter(r => compareIds.includes(r.id));
  }, [filteredResults, compareIds]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareIds(prev => prev.filter(i => i !== id));
  };

  const markers: MapMarker[] = filteredResults
    .filter(r => r.location.lat && r.location.lng)
    .map(r => ({
      id: r.id,
      position: { lat: r.location.lat, lng: r.location.lng },
      title: r.name,
      description: r.category,
      category: r.category,
      isOpen: r.isOpen,
    }));

  const handleMarkerClick = (markerId: string) => {
    setSelectedId(markerId);
    const element = document.getElementById(`result-${markerId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleResultClick = (id: string) => {
    setSelectedId(id);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-foreground-secondary">Searching across Charlotte area...</span>
        <span className="text-sm text-foreground-muted">Finding restaurants, services, and community resources</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-2">Error: {error instanceof Error ? error.message : String(error)}</p>
        <button
          onClick={() => mutate()}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-16 text-foreground-muted">
        <p>Enter a search query to find resources in the Charlotte area</p>
      </div>
    );
  }

  if (!displayData || displayData.results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-foreground-secondary mb-2">No results found for &quot;{query}&quot;</p>
        <p className="text-sm text-foreground-muted">Try different keywords or check spelling</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showCrisisBanner && (
        <CrisisBanner 
          variant={isSevereCrisis ? 'prominent' : 'subtle'}
          showEmergencyResources={isSevereCrisis}
        />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">Search Results</h2>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
          <p className="text-sm text-foreground-muted">
            Found {filteredResults.length} results for &quot;{query}&quot;
            {displayData.sources.curated > 0 && (
              <span className="ml-1 text-sage">({displayData.sources.curated} verified)</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grouped')}
              className={`p-2 transition-colors ${viewMode === 'grouped' ? 'bg-primary/10 text-primary' : 'text-foreground-muted hover:bg-background'}`}
              title="Grouped view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-foreground-muted hover:bg-background'}`}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:border-primary/50 transition-colors md:hidden"
          >
            {showMap ? <List className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
            {showMap ? 'List' : 'Map'}
          </button>
        </div>
      </div>

      <QuickFilters
        filters={filters}
        onFilterChange={setFilters}
        totalResults={filteredResults.length}
        hasLocation={!!userLocation}
        onRequestLocation={requestLocation}
        isRequestingLocation={isRequestingLocation}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`lg:col-span-3 space-y-3 ${showMap ? 'hidden md:block' : ''}`}>
          {viewMode === 'grouped' ? (
            filteredGrouped.map((group, index) => (
              <ResultSection
                key={group.category}
                category={group.category}
                results={group.results}
                initialExpanded={index < 3}
                selectedId={selectedId}
                onResultClick={handleResultClick}
                maxInitialResults={5}
                searchQuery={query}
                compareIds={compareIds}
                onCompareToggle={toggleCompare}
              />
            ))
          ) : (
            <div className="space-y-3">
              {filteredResults.map((result) => (
                <div key={result.id} id={`result-${result.id}`}>
                  <SearchResultCard
                    result={result}
                    isSelected={selectedId === result.id}
                    onClick={() => handleResultClick(result.id)}
                    showCompare
                    isComparing={compareIds.includes(result.id)}
                    onCompareToggle={() => toggleCompare(result.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`lg:col-span-2 ${!showMap ? 'hidden md:block' : ''} lg:sticky lg:top-20 lg:h-[calc(100vh-8rem)]`}>
          <div className="h-full rounded-xl overflow-hidden border border-border">
            <GoogleMap
              markers={markers}
              selectedMarkerId={selectedId}
              onMarkerClick={handleMarkerClick}
              height="100%"
              showUserLocation={!!userLocation}
            />
          </div>
        </div>
      </div>

      {/* Compare floating bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-surface border border-border shadow-lg px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {compareIds.length} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {compareResources.slice(0, 3).map((r) => (
              <div 
                key={r.id}
                className="flex items-center gap-1 px-2 py-1 bg-background text-xs text-foreground-secondary"
              >
                <span className="max-w-[80px] truncate">{r.name}</span>
                <button
                  onClick={() => removeFromCompare(r.id)}
                  className="text-foreground-muted hover:text-error"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowCompareModal(true)}
            disabled={compareIds.length < 2}
            className="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare
          </button>
          <button
            onClick={() => setCompareIds([])}
            className="text-sm text-foreground-muted hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

      {/* Compare modal */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        resources={compareResources}
        onRemove={removeFromCompare}
      />
    </div>
  );
}
