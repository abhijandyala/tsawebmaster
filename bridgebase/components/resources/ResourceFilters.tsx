'use client';

import { Search, X, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Category, FilterState, Cost, Format, Audience } from '@/lib/types';
import { categories, neighborhoods } from '@/data/resources';
import { cn } from '@/lib/utils';

interface ResourceFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  resultCount: number;
}

const costOptions = [
  { value: '', label: 'Any cost' },
  { value: 'Free', label: 'Free' },
  { value: 'Low-cost', label: 'Low-cost' },
  { value: 'Varies', label: 'Varies' },
];

const formatOptions = [
  { value: '', label: 'Any format' },
  { value: 'In-person', label: 'In-person' },
  { value: 'Online', label: 'Online' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const audienceOptions = [
  { value: '', label: 'All audiences' },
  { value: 'Youth', label: 'Youth' },
  { value: 'Families', label: 'Families' },
  { value: 'Seniors', label: 'Seniors' },
  { value: 'General', label: 'General' },
];

const sortOptions = [
  { value: 'relevant', label: 'Most relevant' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'nearby', label: 'Nearby' },
];

export function ResourceFilters({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
}: ResourceFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.neighborhood ||
    filters.cost ||
    filters.format ||
    filters.audience ||
    filters.openNow;

  const toggleCategory = (category: Category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ categories: newCategories });
  };

  return (
    <div className="space-y-5">
      <div className="relative">
        <Input
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search resources by name, service, or keyword..."
          icon={<Search className="w-5 h-5" />}
          className="h-12"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background-alt text-foreground-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => toggleCategory(cat.name)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium border transition-colors',
              filters.categories.includes(cat.name)
                ? 'bg-primary text-white border-primary'
                : 'bg-surface border-border text-foreground-secondary hover:border-primary/40 hover:text-foreground'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Select
          options={[
            { value: '', label: 'All neighborhoods' },
            ...neighborhoods.map((n) => ({ value: n, label: n })),
          ]}
          value={filters.neighborhood}
          onChange={(e) => onFilterChange({ neighborhood: e.target.value })}
          placeholder="Neighborhood"
        />
        <Select
          options={costOptions}
          value={filters.cost}
          onChange={(e) => onFilterChange({ cost: e.target.value as Cost | '' })}
        />
        <Select
          options={formatOptions}
          value={filters.format}
          onChange={(e) => onFilterChange({ format: e.target.value as Format | '' })}
        />
        <Select
          options={audienceOptions}
          value={filters.audience}
          onChange={(e) => onFilterChange({ audience: e.target.value as Audience | '' })}
        />
        <Select
          options={sortOptions}
          value={filters.sort}
          onChange={(e) =>
            onFilterChange({ sort: e.target.value as 'relevant' | 'alphabetical' | 'nearby' })
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.openNow}
              onChange={(e) => onFilterChange({ openNow: e.target.checked })}
              className="w-4 h-4 border-border text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-sm font-medium text-foreground">Open now</span>
          </label>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-foreground-secondary hover:text-foreground gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Clear filters
            </Button>
          )}
        </div>

        <p className="text-sm text-foreground-secondary">
          <span className="font-semibold text-foreground tabular-nums">{resultCount}</span>{' '}
          {resultCount === 1 ? 'resource' : 'resources'} found
        </p>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-foreground-muted">Active:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
              "{filters.search}"
              <button onClick={() => onFilterChange({ search: '' })} className="hover:text-primary-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.categories.map((cat) => (
            <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
              {cat}
              <button onClick={() => toggleCategory(cat)} className="hover:text-primary-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.neighborhood && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
              {filters.neighborhood}
              <button onClick={() => onFilterChange({ neighborhood: '' })} className="hover:text-primary-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.cost && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
              {filters.cost}
              <button onClick={() => onFilterChange({ cost: '' })} className="hover:text-primary-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.format && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
              {filters.format}
              <button onClick={() => onFilterChange({ format: '' })} className="hover:text-primary-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.audience && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
              {filters.audience}
              <button onClick={() => onFilterChange({ audience: '' })} className="hover:text-primary-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.openNow && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
              Open now
              <button onClick={() => onFilterChange({ openNow: false })} className="hover:text-primary-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
