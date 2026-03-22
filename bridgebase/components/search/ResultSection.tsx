'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SearchResultCard } from './SearchResultCard';
import { SearchResult } from '@/lib/searchService';

interface ResultSectionProps {
  category: string;
  results: SearchResult[];
  initialExpanded?: boolean;
  selectedId: string | null;
  onResultClick: (id: string) => void;
  maxInitialResults?: number;
  searchQuery?: string;
  compareIds?: string[];
  onCompareToggle?: (id: string) => void;
}

export function ResultSection({
  category,
  results,
  initialExpanded = true,
  selectedId,
  onResultClick,
  maxInitialResults = 5,
  searchQuery,
  compareIds = [],
  onCompareToggle,
}: ResultSectionProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showAll, setShowAll] = useState(false);

  const displayResults = showAll ? results : results.slice(0, maxInitialResults);
  const hasMore = results.length > maxInitialResults;
  const remainingCount = results.length - maxInitialResults;

  const getDisplayName = () => {
    if (!searchQuery) return category;
    if (category === 'Restaurant' || category === 'Food') {
      const commonAdjectives = ['best', 'good', 'great', 'top', 'cheap', 'new', 'local', 'nearby', 'nice', 'popular', 'famous', 'authentic', 'real', 'find', 'show', 'me', 'the', 'a', 'an'];
      const words = searchQuery.toLowerCase().split(/\s+/);
      const meaningfulWord = words.find(w => w.length > 2 && !commonAdjectives.includes(w));
      if (meaningfulWord) {
        return `${meaningfulWord.charAt(0).toUpperCase() + meaningfulWord.slice(1)} Restaurants`;
      }
    }
    return category;
  };
  const displayName = getDisplayName();

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-surface/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-background/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-foreground">{displayName}</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {results.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-foreground-muted" />
        ) : (
          <ChevronRight className="w-5 h-5 text-foreground-muted" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border">
          <div className="p-3 space-y-2">
            {displayResults.map((result) => (
              <div key={result.id} id={`result-${result.id}`}>
                <SearchResultCard
                  result={result}
                  isSelected={selectedId === result.id}
                  onClick={() => onResultClick(result.id)}
                  compact
                  showCompare={!!onCompareToggle}
                  isComparing={compareIds.includes(result.id)}
                  onCompareToggle={onCompareToggle ? () => onCompareToggle(result.id) : undefined}
                />
              </div>
            ))}
          </div>

          {hasMore && !showAll && (
            <div className="px-3 pb-3">
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Show {remainingCount} more results
              </button>
            </div>
          )}

          {showAll && hasMore && (
            <div className="px-3 pb-3">
              <button
                onClick={() => setShowAll(false)}
                className="w-full py-2 text-sm font-medium text-foreground-muted hover:bg-background/50 rounded-lg transition-colors"
              >
                Show less
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
