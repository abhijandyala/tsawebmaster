'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ResourceGrid } from '@/components/resources/ResourceGrid';
import { resources } from '@/data/resources';
import { FilterState, Category, Audience } from '@/lib/types';
import { isOpenNow } from '@/lib/utils';

interface ResourceDirectoryProps {
  initialSearch?: string;
  initialCategory?: Category;
}

const defaultFilters: FilterState = {
  search: '',
  categories: [],
  neighborhood: '',
  cost: '',
  format: '',
  audience: '',
  openNow: false,
  sort: 'relevant',
};

export function ResourceDirectory({ initialSearch, initialCategory }: ResourceDirectoryProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    search: initialSearch || '',
    categories: initialCategory ? [initialCategory] : [],
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (initialSearch) {
      setFilters((prev) => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.includes(initialCategory)
          ? prev.categories
          : [initialCategory],
      }));
    }
  }, [initialCategory]);

  const filteredResources = useMemo(() => {
    let result = [...resources];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.category.toLowerCase().includes(searchLower) ||
          r.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((r) => filters.categories.includes(r.category));
    }

    if (filters.openNow && isClient) {
      result = result.filter((r) => isOpenNow(r.hours));
    }

    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return result;
  }, [filters, isClient]);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasFilters = filters.search || filters.categories.length > 0;

  return (
    <section id="directory" className="section-padding-lg bg-background-alt">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            All Resources
          </h2>
          <p className="text-foreground-secondary">
            {filteredResources.length} resources available
          </p>
        </motion.div>

        {/* Simple search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search resources..."
              className="w-full h-12 pl-12 pr-10 bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {hasFilters && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {filters.categories.map((cat) => (
                <span key={cat} className="px-2 py-1 bg-primary/10 text-primary text-sm flex items-center gap-1">
                  {cat}
                  <button 
                    onClick={() => setFilters((prev) => ({ 
                      ...prev, 
                      categories: prev.categories.filter((c) => c !== cat) 
                    }))}
                    className="hover:text-primary-dark"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-sm text-foreground-muted hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        <ResourceGrid
          resources={filteredResources}
          onClearFilters={clearFilters}
        />
      </div>
    </section>
  );
}
