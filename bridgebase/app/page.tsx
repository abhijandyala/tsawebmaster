'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components/layout';
import {
  HeroSection,
  CategoryStrip,
  HowItHelps,
  SubmitResourceForm,
  AboutSection,
  FeaturedResources,
  LifeSituationCards,
} from '@/components/sections';
import { scrollToSection } from '@/lib/utils';
import { SearchResults } from '@/components/search/SearchResults';
import { Category } from '@/lib/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(undefined);
    setShowSearchResults(true);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSearchQuery(category);
    setShowSearchResults(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setShowSearchResults(false);
  };

  const handleSituationSelect = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(undefined);
    setShowSearchResults(true);
    setTimeout(() => scrollToSection('search-results'), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <HeroSection onSearch={handleSearch} currentQuery={searchQuery} />
        
        <CategoryStrip
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
        
        {showSearchResults && searchQuery ? (
          <section id="search-results" className="section-padding">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <SearchResults query={searchQuery} onClearSearch={handleClearSearch} />
            </div>
          </section>
        ) : (
          <>
            <LifeSituationCards onSituationSelect={handleSituationSelect} />
            <FeaturedResources />
            <HowItHelps />
            <AboutSection />
          </>
        )}
        
        <SubmitResourceForm />
      </main>
      
      <Footer />
    </div>
  );
}
