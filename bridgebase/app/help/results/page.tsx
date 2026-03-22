'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import {
  ArrowLeft, Phone, MapPin, ExternalLink, Clock, Check, Star,
  AlertCircle, Loader2, ChevronRight, Globe, Users
} from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import { CrisisBanner } from '@/components/ui/CrisisBanner';
import {
  WizardState,
  decodeWizardState,
  buildSearchQuery,
  WIZARD_CATEGORIES,
} from '@/lib/wizardTypes';
import { SearchResult } from '@/lib/searchService';

interface SearchApiResponse {
  results: SearchResult[];
  total: number;
}

const fetcher = async (url: string): Promise<SearchApiResponse> => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to search');
  return data;
};

function HelpResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const encodedState = searchParams.get('state');
  const [wizardState, setWizardState] = useState<WizardState | null>(null);

  useEffect(() => {
    if (encodedState) {
      const decoded = decodeWizardState(encodedState);
      setWizardState(decoded);
    }
  }, [encodedState]);

  const searchQuery = useMemo(() => {
    if (!wizardState) return null;
    return buildSearchQuery(wizardState);
  }, [wizardState]);

  const searchUrl = useMemo(() => {
    if (!searchQuery) return null;
    return `/api/search?q=${encodeURIComponent(searchQuery)}`;
  }, [searchQuery]);

  const { data, error, isLoading } = useSWR<SearchApiResponse>(
    searchUrl,
    fetcher,
    { revalidateOnFocus: false }
  );

  const filteredResults = useMemo(() => {
    if (!data?.results || !wizardState) return [];
    
    let results = [...data.results];
    
    if (wizardState.freeOnly) {
      results = results.filter(r => r.cost === 'Free' || r.priceLevel === 0);
    }
    
    if (wizardState.walkInsOnly) {
      results = results.filter(r => r.walkIn === true);
    }
    
    if (wizardState.language && wizardState.language !== 'english') {
      const langMap: Record<string, string> = {
        spanish: 'Spanish',
        chinese: 'Chinese',
        vietnamese: 'Vietnamese',
      };
      const langFilter = langMap[wizardState.language];
      if (langFilter) {
        results = results.filter(r => r.languages?.includes(langFilter));
      }
    }

    return results.slice(0, 10);
  }, [data?.results, wizardState]);

  const generateMatchReason = (result: SearchResult): string[] => {
    if (!wizardState) return [];
    const reasons: string[] = [];
    
    if (result.cost === 'Free') reasons.push('Free service');
    else if (result.cost) reasons.push(result.cost);
    
    if (result.walkIn) reasons.push('Walk-ins welcome');
    
    if (result.languages && result.languages.length > 1) {
      reasons.push(`Speaks ${result.languages.slice(0, 2).join(', ')}`);
    }
    
    if (result.distance) {
      reasons.push(`${result.distance.toFixed(1)} miles away`);
    }
    
    if (wizardState.eligibilityTags.length > 0 && result.eligibility) {
      const eligLower = result.eligibility.toLowerCase();
      if (wizardState.eligibilityTags.some(tag => eligLower.includes(tag))) {
        reasons.push('Matches your situation');
      }
    }

    return reasons;
  };

  const categoryLabel = WIZARD_CATEGORIES.find(c => c.id === wizardState?.category)?.label || 'Resources';

  if (!encodedState || !wizardState) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-foreground-secondary">Invalid or missing wizard state.</p>
            <Link href="/help" className="text-primary hover:underline mt-4 inline-block">
              Start over
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link 
            href="/help"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Start over
          </Link>

          {/* Crisis banner for urgent needs */}
          {wizardState.urgency === 'today' && (
            <CrisisBanner variant="prominent" showEmergencyResources />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              {categoryLabel} resources for you
            </h1>
            <p className="text-foreground-secondary">
              Based on your needs, here are the best matches in Charlotte
            </p>
            
            {/* Summary tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {wizardState.freeOnly && (
                <span className="px-3 py-1 text-xs font-medium bg-success-surface text-success">
                  Free only
                </span>
              )}
              {wizardState.walkInsOnly && (
                <span className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent">
                  Walk-ins
                </span>
              )}
              {wizardState.language && wizardState.language !== 'english' && (
                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary">
                  {wizardState.language.charAt(0).toUpperCase() + wizardState.language.slice(1)}
                </span>
              )}
              {wizardState.urgency === 'today' && (
                <span className="px-3 py-1 text-xs font-medium bg-warning-surface text-warning">
                  Urgent
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-foreground-secondary">Finding the best resources for you...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-error mb-2">Something went wrong</p>
              <Link href="/help" className="text-primary hover:underline">
                Try again
              </Link>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
              <p className="text-foreground-secondary mb-2">No exact matches found</p>
              <p className="text-sm text-foreground-muted mb-4">
                Try adjusting your preferences or search more broadly
              </p>
              <Link href="/help" className="text-primary hover:underline">
                Modify your search
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result, index) => {
                const matchReasons = generateMatchReason(result);
                const isCurated = !result.placeId;
                
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      onClick={() => router.push(isCurated ? `/resource/${result.id}` : `/place/${result.placeId}`)}
                      className="block p-5 bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Badges */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {isCurated && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-success-surface text-success">
                                <Check className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                            {result.rating && result.rating >= 4 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gold/10 text-gold">
                                <Star className="w-3 h-3 fill-current" />
                                {result.rating.toFixed(1)}
                              </span>
                            )}
                            <span className="text-xs text-foreground-muted">
                              {result.category}
                            </span>
                          </div>

                          {/* Name */}
                          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {result.name}
                          </h3>

                          {/* Match reasons */}
                          {matchReasons.length > 0 && (
                            <p className="text-sm text-accent mt-2 italic">
                              Matches because: {matchReasons.join(' • ')}
                            </p>
                          )}

                          {/* Address */}
                          <p className="text-sm text-foreground-secondary mt-2 flex items-start gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {result.location.address}
                          </p>

                          {/* Quick info */}
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-foreground-muted">
                            {result.cost && (
                              <span className="text-success font-medium">{result.cost}</span>
                            )}
                            {result.walkIn && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Walk-ins OK
                              </span>
                            )}
                            {result.languages && result.languages.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" />
                                {result.languages.slice(0, 2).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                        {result.phone && (
                          <a
                            href={`tel:${result.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            Call Now
                          </a>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(result.location.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border hover:border-primary/50 transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          Directions
                        </a>
                        {result.website && (
                          <a
                            href={result.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border hover:border-primary/50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Next steps */}
          <div className="mt-12 p-6 bg-surface border border-border">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              What to do next
            </h2>
            <ol className="space-y-3 text-sm text-foreground-secondary">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary font-medium flex items-center justify-center text-xs">1</span>
                <span>Call ahead to confirm hours and what to bring</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary font-medium flex items-center justify-center text-xs">2</span>
                <span>Bring ID and any documents they require</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary font-medium flex items-center justify-center text-xs">3</span>
                <span>Ask about other services they offer</span>
              </li>
            </ol>
          </div>

          {/* Additional help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground-muted mb-3">
              Can&apos;t find what you need?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:211"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                Call NC 211
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Search all resources
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function HelpResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground-secondary text-sm">
          Loading…
        </div>
      }
    >
      <HelpResultsContent />
    </Suspense>
  );
}
