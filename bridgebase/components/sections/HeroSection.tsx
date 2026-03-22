'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { scrollToSection } from '@/lib/utils';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  currentQuery?: string;
}

export function HeroSection({ onSearch, currentQuery = '' }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState(currentQuery);

  useEffect(() => {
    setSearchQuery(currentQuery);
  }, [currentQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      scrollToSection('search-results');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-primary text-sm font-medium tracking-wide uppercase mb-6"
        >
          Charlotte Area Resources
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight mb-6"
        >
          Find help in Charlotte
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-foreground-secondary max-w-2xl mx-auto mb-10"
        >
          Discover local resources across Charlotte, Lake Norman, Huntersville, Matthews, 
          Concord, and surrounding areas. All in one place, completely free.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto mb-8"
        >
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search sushi, food banks, jobs, housing..."
                className="w-full h-14 pl-12 pr-28 bg-surface border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors text-base rounded-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-sm text-foreground-muted">or</span>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
            >
              <Heart className="w-4 h-4" />
              I Need Help Now
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              onSearch('restaurants');
              scrollToSection('search-results');
            }}
            className="gap-2"
          >
            Restaurants
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              onSearch('food assistance');
              scrollToSection('search-results');
            }}
            className="gap-2"
          >
            Food Help
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              onSearch('jobs employment');
              scrollToSection('search-results');
            }}
            className="gap-2"
          >
            Jobs
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              onSearch('healthcare clinic');
              scrollToSection('search-results');
            }}
            className="gap-2"
          >
            Healthcare
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex justify-center gap-12 text-sm text-foreground-muted"
        >
          <div>
            <span className="font-display text-2xl font-semibold text-foreground block">11+</span>
            Areas Covered
          </div>
          <div>
            <span className="font-display text-2xl font-semibold text-foreground block">9</span>
            Categories
          </div>
          <div>
            <span className="font-display text-2xl font-semibold text-accent block">Live</span>
            Search
          </div>
        </motion.div>
      </div>
    </section>
  );
}
