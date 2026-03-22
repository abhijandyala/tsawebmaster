'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Phone, Globe, Clock, ExternalLink, ArrowRight, Check, Users, Languages, Navigation, Shield, HelpCircle, Bookmark, BookmarkCheck, Train, Bus } from 'lucide-react';
import { SearchResult, EligibilityStatus, SourceType } from '@/lib/searchService';
import { Badge } from '@/components/ui/Badge';
import { saveResource, isResourceSaved, removeResource } from '@/lib/helpPlan';

function SourceTypeBadge({ sourceType, verified }: { sourceType?: SourceType; verified?: boolean }) {
  if (!sourceType || sourceType === 'unknown') {
    return verified ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-success-surface text-success">
        <Shield className="w-3 h-3" />
        Verified
      </span>
    ) : null;
  }
  
  const config: Record<SourceType, { label: string; className: string }> = {
    government: {
      label: 'Government',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    nonprofit: {
      label: 'Nonprofit',
      className: 'bg-success-surface text-success',
    },
    community: {
      label: 'Community',
      className: 'bg-accent/10 text-accent',
    },
    private: {
      label: 'Business',
      className: 'bg-surface text-foreground-muted border border-border',
    },
    unknown: {
      label: '',
      className: '',
    },
  };
  
  const badgeConfig = config[sourceType];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium ${badgeConfig.className}`}>
      {verified && <Shield className="w-3 h-3" />}
      {badgeConfig.label}
    </span>
  );
}

function EligibilityBadge({ status }: { status?: EligibilityStatus }) {
  if (!status || status === 'unknown') return null;
  
  const config = {
    likely: {
      label: 'Likely eligible',
      className: 'bg-success-surface text-success border-success/30',
      icon: Check,
    },
    possible: {
      label: 'May qualify',
      className: 'bg-warning-surface text-warning border-warning/30',
      icon: HelpCircle,
    },
    check: {
      label: 'Check requirements',
      className: 'bg-surface text-foreground-muted border-border',
      icon: Shield,
    },
  }[status];
  
  if (!config) return null;
  
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

interface SearchResultCardProps {
  result: SearchResult;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  showCompare?: boolean;
  isComparing?: boolean;
  onCompareToggle?: () => void;
}

export function SearchResultCard({ 
  result, 
  isSelected, 
  onClick, 
  compact = false,
  showCompare = false,
  isComparing = false,
  onCompareToggle,
}: SearchResultCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isResourceSaved(result.id));
    
    const handleUpdate = () => setIsSaved(isResourceSaved(result.id));
    window.addEventListener('help-plan-updated', handleUpdate);
    return () => window.removeEventListener('help-plan-updated', handleUpdate);
  }, [result.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      removeResource(result.id);
    } else {
      saveResource(result);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result.placeId) {
      router.push(`/place/${result.placeId}`);
    } else if (result.source === 'curated') {
      const curatedId = result.id.replace('curated-', '');
      router.push(`/resource/${curatedId}`);
    }
  };

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const destination = `${result.location.lat},${result.location.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };
  const sourceLabel = {
    curated: 'Verified',
    google_places: 'Google',
    web: 'Web',
  }[result.source];

  const sourceColor = {
    curated: 'success',
    google_places: 'accent',
    web: 'default',
  }[result.source] as 'success' | 'accent' | 'default';

  if (compact) {
    return (
      <article
        onClick={onClick}
        className={`
          flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
          ${isSelected 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 bg-surface'
          }
        `}
      >
        {result.photos && result.photos.length > 0 && (
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
            <img
              src={result.photos[0]}
              alt={result.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {result.source === 'curated' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sage/20 text-sage shrink-0">
                Verified
              </span>
            )}
            <h3 className="font-medium text-foreground truncate text-sm">{result.name}</h3>
            {result.rating && (
              <div className="flex items-center gap-0.5 text-xs shrink-0">
                <Star className="w-3 h-3 fill-gold text-gold" />
                <span>{result.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-foreground-muted">
            <span className="truncate max-w-[150px]">{result.location.address.split(',')[0]}</span>
            {result.distance !== undefined && (
              <span className="text-primary font-medium">{result.distance} mi</span>
            )}
            {result.isOpen !== undefined && (
              <span className={result.isOpen ? 'text-sage' : 'text-red-400'}>
                {result.isOpen ? 'Open' : 'Closed'}
              </span>
            )}
            {result.cost === 'Free' && (
              <span className="text-sage font-medium">Free</span>
            )}
            {result.priceLevel !== undefined && result.priceLevel > 0 && (
              <span>{'$'.repeat(result.priceLevel)}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleGetDirections}
            className="p-1.5 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Get directions"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={handleViewDetails}
            className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1"
          >
            View
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className={`
        border transition-all cursor-pointer overflow-hidden rounded-lg
        ${isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 bg-surface'
        }
      `}
    >
      {result.photos && result.photos.length > 0 && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={result.photos[0]}
            alt={result.name}
            className="w-full h-full object-cover"
          />
          {result.photos.length > 1 && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
              +{result.photos.length - 1} photos
            </div>
          )}
        </div>
      )}

      <div className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {result.source === 'curated' ? (
              <SourceTypeBadge sourceType={result.sourceType} verified={result.verified} />
            ) : (
              <Badge variant={sourceColor} className="text-xs">
                {sourceLabel}
              </Badge>
            )}
            <span className="text-xs text-foreground-muted">{result.category}</span>
            {result.lastUpdated && result.source === 'curated' && (
              <span className="text-xs text-foreground-muted">
                Updated {new Date(result.lastUpdated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
          <h3 className="font-medium text-foreground truncate">{result.name}</h3>
        </div>
        
        {result.rating && (
          <div className="flex items-center gap-1 text-sm shrink-0">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="font-medium">{result.rating.toFixed(1)}</span>
            {result.reviewCount && (
              <span className="text-foreground-muted">({result.reviewCount.toLocaleString()})</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[200px]">{result.location.address}</span>
        </div>

        {result.distance !== undefined && (
          <span className="text-primary font-medium">{result.distance} mi</span>
        )}

        {result.isOpen !== undefined && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className={result.isOpen ? 'text-sage' : 'text-red-400'}>
              {result.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        )}

        {result.priceLevel !== undefined && (
          <span>{'$'.repeat(result.priceLevel)}</span>
        )}
      </div>

      {result.source === 'curated' && (
        <div className="flex flex-wrap gap-2 mb-3">
          {result.cost && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              result.cost === 'Free' ? 'bg-sage/20 text-sage' : 'bg-gold/20 text-gold'
            }`}>
              {result.cost}
            </span>
          )}
          {result.walkIn && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <Check className="w-3 h-3" />
              Walk-ins Welcome
            </span>
          )}
          {result.languages && result.languages.length > 1 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-surface border border-border text-foreground-secondary">
              <Languages className="w-3 h-3" />
              {result.languages.slice(0, 3).join(', ')}
            </span>
          )}
        </div>
      )}

      {result.matchReasons && result.matchReasons.length > 0 && (
        <p className="text-xs text-accent italic mb-3">
          Matches: {result.matchReasons.slice(0, 4).join(' • ')}
        </p>
      )}

      {result.transitInfo?.transitAccessible && (
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
          {result.transitInfo.nearLightRail && (
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              <Train className="w-3 h-3" />
              Near {result.transitInfo.lightRailStation}
            </span>
          )}
          {result.transitInfo.nearBusRoute && result.transitInfo.busRoutes && (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              <Bus className="w-3 h-3" />
              Bus routes nearby
            </span>
          )}
        </div>
      )}

      {result.eligibility && (
        <div className="mb-3 p-2 rounded-lg bg-background border border-border">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs text-foreground-muted flex items-center gap-1">
              <Users className="w-3 h-3" />
              Eligibility
            </p>
            <EligibilityBadge status={result.eligibilityStatus} />
          </div>
          <p className="text-sm text-foreground-secondary line-clamp-2">{result.eligibility}</p>
        </div>
      )}

      {(result.phone || result.website) && (
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          {result.phone && (
            <a
              href={`tel:${result.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Phone className="w-3 h-3" />
              {result.phone}
            </a>
          )}
          {result.website && (
            <a
              href={result.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Globe className="w-3 h-3" />
              Website
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {showCompare && onCompareToggle && (
          <button
            onClick={(e) => { e.stopPropagation(); onCompareToggle(); }}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium border transition-colors ${
              isComparing
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border text-foreground-secondary hover:border-primary/40'
            }`}
            title="Add to compare"
          >
            {isComparing ? <Check className="w-4 h-4" /> : <span className="w-4 h-4 border border-current rounded" />}
          </button>
        )}
        <button
          onClick={handleSaveToggle}
          className={`flex items-center justify-center py-2 px-3 text-sm font-medium border transition-colors ${
            isSaved
              ? 'bg-accent/10 border-accent text-accent'
              : 'border-border text-foreground-secondary hover:border-accent/40 hover:text-accent'
          }`}
          title={isSaved ? 'Remove from plan' : 'Save to plan'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
        <button
          onClick={handleGetDirections}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-foreground-secondary hover:text-primary hover:bg-primary/5 border border-border hover:border-primary/40 rounded-lg transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
        {(result.placeId || result.source === 'curated') && (
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:bg-primary/5 border border-primary/20 hover:border-primary/40 rounded-lg transition-colors"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      </div>
    </article>
  );
}
