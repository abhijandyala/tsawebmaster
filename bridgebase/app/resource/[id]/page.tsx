'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  DollarSign,
  Building2,
  Languages,
  CheckCircle2,
  Accessibility,
  Share2,
  Bookmark,
  Navigation,
  Star,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { resources } from '@/data/resources';

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const resource = useMemo(() => {
    const id = params.id as string;
    return resources.find((r) => r.id === id) || null;
  }, [params.id]);

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined' || !resource) return;
    
    const url = window.location.href;
    const shareData = {
      title: resource.name,
      text: resource.description,
      url: url,
    };

    const canUseWebShare = typeof navigator !== 'undefined' && 
      'share' in navigator && 
      typeof navigator.canShare === 'function' && 
      navigator.canShare(shareData);

    if (canUseWebShare) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          await navigator.clipboard.writeText(url);
        }
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }, [resource]);

  const handleOpenWebsite = useCallback((url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }, []);

  const handleCall = useCallback((phone: string) => {
    if (typeof window !== 'undefined') {
      window.open(`tel:${phone.replace(/\D/g, '')}`);
    }
  }, []);

  const handleGetDirections = useCallback((address: string, city: string) => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(address + ', ' + city)}`,
        '_blank'
      );
    }
  }, []);

  if (!resource) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Resource not found</h1>
            <p className="text-foreground-secondary mb-6">The resource you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/#directory')}>
              Back to Directory
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <div className="bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Directory</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="accent" size="md" className="bg-white/20 text-white border-0">
                    {resource.category}
                  </Badge>
                  {resource.featured && (
                    <Badge variant="warning" size="md" className="bg-warning/20 text-warning border-0">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  {resource.name}
                </h1>
                <p className="text-white/80 text-lg max-w-2xl">
                  {resource.description}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-3 rounded-xl transition-colors ${
                    isBookmarked
                      ? 'bg-warning/20 text-warning'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-surface border border-border rounded-2xl p-6 lg:p-8"
              >
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Services Offered
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resource.services.map((service, index) => (
                    <div
                      key={service}
                      className="flex items-start gap-3 p-4 bg-background rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-foreground font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {resource.eligibility && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-surface border border-border rounded-2xl p-6 lg:p-8"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Eligibility Requirements
                  </h2>
                  <p className="text-foreground-secondary leading-relaxed">
                    {resource.eligibility}
                  </p>
                </motion.section>
              )}

              {resource.accessibilityNotes && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-surface border border-border rounded-2xl p-6 lg:p-8"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-primary" />
                    Accessibility Information
                  </h2>
                  <p className="text-foreground-secondary leading-relaxed">
                    {resource.accessibilityNotes}
                  </p>
                </motion.section>
              )}

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-surface border border-border rounded-2xl p-6 lg:p-8"
              >
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Additional Information
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-background rounded-xl text-center">
                    <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-foreground-muted mb-1">Cost</p>
                    <p className="font-semibold text-foreground">{resource.cost}</p>
                  </div>
                  <div className="p-4 bg-background rounded-xl text-center">
                    <Building2 className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-foreground-muted mb-1">Format</p>
                    <p className="font-semibold text-foreground">{resource.format}</p>
                  </div>
                  <div className="p-4 bg-background rounded-xl text-center">
                    <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-foreground-muted mb-1">Audience</p>
                    <p className="font-semibold text-foreground text-sm">{resource.audience.join(', ')}</p>
                  </div>
                  <div className="p-4 bg-background rounded-xl text-center">
                    <Languages className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-foreground-muted mb-1">Languages</p>
                    <p className="font-semibold text-foreground text-sm">{resource.languages.length}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground-muted mb-3">Languages Supported</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.languages.map((lang) => (
                      <Badge key={lang} variant="outline" size="md">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground-muted mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="success" size="md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.section>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-surface border border-border rounded-2xl p-6 sticky top-24"
              >
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(resource.address + ', ' + resource.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 bg-background rounded-xl hover:bg-background-alt transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {resource.address}
                      </p>
                      <p className="text-sm text-foreground-secondary">
                        {resource.city}
                        {resource.neighborhood && ` • ${resource.neighborhood}`}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`tel:${resource.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-background-alt transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {resource.phone}
                      </p>
                      <p className="text-sm text-foreground-secondary">Call now</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${resource.email}`}
                    className="flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-background-alt transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm break-all">
                        {resource.email}
                      </p>
                      <p className="text-sm text-foreground-secondary">Send email</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{resource.hours}</p>
                      <p className="text-sm text-foreground-secondary">Hours of operation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  {resource.website && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full gap-2"
                      onClick={() => handleOpenWebsite(resource.website)}
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => handleGetDirections(resource.address, resource.city)}
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => handleCall(resource.phone)}
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
