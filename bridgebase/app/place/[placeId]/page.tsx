'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  Share2,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Quote,
  ExternalLink,
} from 'lucide-react';
import { PublicChrome } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GoogleMap } from '@/components/maps/GoogleMap';

interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  location: {
    lat: number;
    lng: number;
  };
  hours?: string[];
  isOpen?: boolean;
  reviews: Review[];
  types: string[];
  photos: string[];
}

interface Review {
  authorName: string;
  rating: number;
  text: string;
  time: number;
  relativeTime: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch place details');
  return response.json();
};

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const placeId = params.placeId as string;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { data: place, error, isLoading } = useSWR<PlaceDetails>(
    placeId ? `/api/places/details?placeId=${placeId}` : null,
    fetcher
  );

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined' || !place) return;
    
    const url = window.location.href;
    const shareData = {
      title: place.name,
      text: `Check out ${place.name} on Charlotte Connect`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        await navigator.clipboard?.writeText(url);
      }
    } else {
      await navigator.clipboard?.writeText(url);
    }
  }, [place]);

  const nextPhoto = () => {
    if (place?.photos) {
      setCurrentPhotoIndex((prev) => (prev + 1) % place.photos.length);
    }
  };

  const prevPhoto = () => {
    if (place?.photos) {
      setCurrentPhotoIndex((prev) => (prev - 1 + place.photos.length) % place.photos.length);
    }
  };

  const getTypeLabel = (types: string[]) => {
    const typeMap: Record<string, string> = {
      restaurant: 'Restaurant',
      food: 'Food',
      cafe: 'Cafe',
      bar: 'Bar',
      hospital: 'Healthcare',
      doctor: 'Doctor',
      health: 'Health',
      pharmacy: 'Pharmacy',
      store: 'Store',
      shopping_mall: 'Shopping',
    };
    for (const type of types) {
      if (typeMap[type]) return typeMap[type];
    }
    return 'Local Business';
  };

  if (isLoading) {
    return (
      <PublicChrome>
        <div className="pt-8 pb-16">
          <div className="max-w-6xl mx-auto w-full">
            <div className="animate-pulse space-y-8">
              <div className="h-96 bg-surface-muted rounded-2xl border border-border" />
              <div className="h-8 bg-surface-muted rounded-xl w-1/2 border border-border" />
              <div className="h-4 bg-surface-muted rounded-lg w-3/4 border border-border" />
            </div>
          </div>
        </div>
      </PublicChrome>
    );
  }

  if (error || !place) {
    return (
      <PublicChrome>
        <div className="pt-16 pb-16">
          <div className="max-w-4xl mx-auto w-full text-center py-20">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Place not found</h1>
            <p className="text-foreground-secondary mb-6">Unable to load details for this place.</p>
            <Button onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </PublicChrome>
    );
  }

  const topReviews = place.reviews
    .filter(r => r.rating >= 4 && r.text.length > 50)
    .slice(0, 3);

  return (
    <PublicChrome>
      <div className="pt-6">
        {/* Photo Gallery */}
        {place.photos && place.photos.length > 0 && (
          <div className="relative h-[50vh] min-h-[400px] max-h-[600px] bg-background-alt overflow-hidden">
            <motion.img
              key={currentPhotoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={place.photos[currentPhotoIndex]}
              alt={`${place.name} - Photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Photo Navigation */}
            {place.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {place.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Back Button Overlay */}
            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="max-w-6xl mx-auto w-full py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="accent" size="md">
                {getTypeLabel(place.types)}
              </Badge>
              {place.isOpen !== undefined && (
                <Badge variant={place.isOpen ? 'success' : 'default'} size="md">
                  {place.isOpen ? 'Open Now' : 'Closed'}
                </Badge>
              )}
              {place.priceLevel && (
                <span className="text-foreground-muted">
                  {'$'.repeat(place.priceLevel)}
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              {place.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-foreground-secondary">
              {place.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-gold">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold text-foreground">{place.rating.toFixed(1)}</span>
                  </div>
                  {place.userRatingsTotal && (
                    <span>({place.userRatingsTotal.toLocaleString()} reviews)</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{place.address}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Reviews Section */}
              {topReviews.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
                    What People Are Saying
                  </h2>
                  <div className="space-y-6">
                    {topReviews.map((review, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="relative bg-surface border border-border p-8 group"
                      >
                        <Quote className="absolute top-6 left-6 w-8 h-8 text-primary/20" />
                        <div className="relative">
                          <p className="text-lg text-foreground leading-relaxed mb-6 pl-6">
                            &ldquo;{review.text}&rdquo;
                          </p>
                          <div className="flex items-center justify-between pl-6">
                            <div>
                              <p className="font-medium text-foreground">{review.authorName}</p>
                              <p className="text-sm text-foreground-muted">{review.relativeTime}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-gold fill-current'
                                      : 'text-foreground-muted'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Hours Section */}
              {place.hours && place.hours.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-surface border border-border p-8"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    Hours of Operation
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {place.hours.map((hours, idx) => (
                      <div key={idx} className="text-foreground-secondary py-2 border-b border-border/50 last:border-0">
                        {hours}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Map Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Location
                </h2>
                <div className="rounded-xl overflow-hidden border border-border">
                  <GoogleMap
                    markers={[{
                      id: place.placeId,
                      position: place.location,
                      title: place.name,
                    }]}
                    center={place.location}
                    zoom={16}
                    height="300px"
                    showUserLocation={false}
                  />
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`, '_blank')}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-base font-medium bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                >
                  <Navigation className="w-5 h-5" />
                  Open in Google Maps
                </button>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-surface border border-border p-6 sticky top-24 space-y-6"
              >
                <div className="space-y-4">
                  {place.phone && (
                    <a
                      href={`tel:${place.phone.replace(/\D/g, '')}`}
                      className="flex items-center gap-4 p-4 bg-background hover:bg-background-alt transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {place.phone}
                        </p>
                        <p className="text-sm text-foreground-muted">Call now</p>
                      </div>
                    </a>
                  )}

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 bg-background hover:bg-background-alt transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        Get Directions
                      </p>
                      <p className="text-sm text-foreground-muted line-clamp-2">{place.address}</p>
                    </div>
                  </a>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  {place.website && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full gap-2"
                      onClick={() => window.open(place.website, '_blank')}
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(place.address)}`, '_blank')}
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </Button>
                  {place.phone && (
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full gap-2"
                      onClick={() => window.open(`tel:${place.phone?.replace(/\D/g, '')}`)}
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </Button>
                  )}
                </div>

                {/* All Photos Thumbnail Grid */}
                {place.photos && place.photos.length > 1 && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground-muted mb-3">Photos</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {place.photos.slice(0, 6).map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentPhotoIndex(idx);
                            if (typeof window !== 'undefined') {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className={`aspect-square overflow-hidden ${
                            idx === currentPhotoIndex ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`${place.name} photo ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PublicChrome>
  );
}
