'use client';

import { useState } from 'react';
import { MapPin, Clock, DollarSign, Star, ChevronDown, Loader2 } from 'lucide-react';

export interface FilterState {
  openNow: boolean;
  freeOnly: boolean;
  highlyRated: boolean;
  nearMe: boolean;
  sortBy: 'relevance' | 'rating' | 'distance' | 'reviews';
}

interface QuickFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
  resultsByCategory: Record<string, number>;
  hasLocation: boolean;
  onRequestLocation: () => void;
  isRequestingLocation?: boolean;
}

export function QuickFilters({ 
  filters, 
  onFilterChange, 
  totalResults, 
  resultsByCategory,
  hasLocation,
  onRequestLocation,
  isRequestingLocation = false,
}: QuickFiltersProps) {
  const [showSort, setShowSort] = useState(false);

  const toggleFilter = (key: keyof Omit<FilterState, 'sortBy'>) => {
    if (key === 'nearMe' && !hasLocation) {
      onRequestLocation();
      return;
    }
    onFilterChange({ ...filters, [key]: !filters[key] });
  };

  const setSortBy = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
    setShowSort(false);
  };

  const sortLabels: Record<FilterState['sortBy'], string> = {
    relevance: 'Relevance',
    rating: 'Highest Rated',
    distance: 'Nearest',
    reviews: 'Most Reviews',
  };

  const activeFiltersCount = [filters.openNow, filters.freeOnly, filters.highlyRated, filters.nearMe].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => toggleFilter('openNow')}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${filters.openNow 
              ? 'bg-primary text-white' 
              : 'bg-surface border border-border hover:border-primary/50 text-foreground-secondary'
            }
          `}
        >
          <Clock className="w-3.5 h-3.5" />
          Open Now
        </button>

        <button
          onClick={() => toggleFilter('freeOnly')}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${filters.freeOnly 
              ? 'bg-primary text-white' 
              : 'bg-surface border border-border hover:border-primary/50 text-foreground-secondary'
            }
          `}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Free
        </button>

        <button
          onClick={() => toggleFilter('highlyRated')}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${filters.highlyRated 
              ? 'bg-primary text-white' 
              : 'bg-surface border border-border hover:border-primary/50 text-foreground-secondary'
            }
          `}
        >
          <Star className="w-3.5 h-3.5" />
          4+ Stars
        </button>

        <button
          onClick={() => toggleFilter('nearMe')}
          disabled={isRequestingLocation}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${filters.nearMe && hasLocation
              ? 'bg-primary text-white' 
              : 'bg-surface border border-border hover:border-primary/50 text-foreground-secondary'
            }
            ${isRequestingLocation ? 'opacity-70 cursor-wait' : ''}
          `}
        >
          {isRequestingLocation ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <MapPin className="w-3.5 h-3.5" />
          )}
          {isRequestingLocation ? 'Getting location...' : 'Near Me'}
        </button>

        <div className="relative ml-auto">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-surface border border-border hover:border-primary/50 text-foreground-secondary transition-all"
          >
            Sort: {sortLabels[filters.sortBy]}
            <ChevronDown className={`w-4 h-4 transition-transform ${showSort ? 'rotate-180' : ''}`} />
          </button>

          {showSort && (
            <div className="absolute right-0 top-full mt-1 py-1 bg-surface border border-border rounded-lg shadow-lg z-10 min-w-[150px]">
              {(Object.keys(sortLabels) as FilterState['sortBy'][]).map((key) => {
                const isDistanceDisabled = key === 'distance' && !hasLocation;
                return (
                  <button
                    key={key}
                    onClick={() => !isDistanceDisabled && setSortBy(key)}
                    disabled={isDistanceDisabled}
                    className={`
                      w-full px-3 py-2 text-left text-sm transition-colors
                      ${filters.sortBy === key 
                        ? 'bg-primary/10 text-primary' 
                        : isDistanceDisabled
                          ? 'text-foreground-muted cursor-not-allowed opacity-50'
                          : 'hover:bg-background text-foreground-secondary'
                      }
                    `}
                  >
                    {sortLabels[key]}
                    {isDistanceDisabled && <span className="text-xs ml-1">(needs location)</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-foreground-muted">
            Showing {totalResults} results with {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
          </span>
          <button
            onClick={() => onFilterChange({
              openNow: false,
              freeOnly: false,
              highlyRated: false,
              nearMe: false,
              sortBy: 'relevance',
            })}
            className="text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
