'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Share2,
  Bookmark,
  Navigation,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { resources } from '@/data/resources';
import { resourceCoverSrc, resourceImageGradient } from '@/lib/resourceImage';
import { addFavorite, removeFavorite, listFavoriteIds, touchRecentView } from '@/lib/firestoreUser';
import { pushLocalRecent } from '@/lib/localRecent';
import { getLocalFavoriteIds, toggleLocalFavorite } from '@/lib/localFavorites';
import { subscribeResourceReviews, submitReview, type FirestoreReview } from '@/lib/firestoreReviews';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { GoogleMap, type MapMarker } from '@/components/maps/GoogleMap';
import { StarRatingDisplay, StarRatingInput } from '@/components/ui/StarRating';
import { CHARLOTTE_AREA } from '@/data/resources';

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [favIds, setFavIds] = useState<string[]>([]);
  const [reviews, setReviews] = useState<FirestoreReview[]>([]);
  const [avg, setAvg] = useState(0);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [ratingIn, setRatingIn] = useState(4.5);
  const [textIn, setTextIn] = useState('');
  const [anon, setAnon] = useState(false);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewErr, setReviewErr] = useState('');

  const resource = useMemo(() => {
    const id = params.id as string;
    return resources.find((r) => r.id === id) || null;
  }, [params.id]);

  const isBookmarked = resource ? favIds.includes(resource.id) : false;

  useEffect(() => {
    if (!resource) return;
    pushLocalRecent(resource.id);
    if (user) {
      touchRecentView(user, resource.id).catch(() => {});
      listFavoriteIds(user).then(setFavIds).catch(() => {});
    } else {
      setFavIds(getLocalFavoriteIds());
    }
  }, [resource, user]);

  useEffect(() => {
    if (!resource) return;
    return subscribeResourceReviews(resource.id, (list, a) => {
      setReviews(list);
      setAvg(a);
    });
  }, [resource]);

  const toggleBookmark = async () => {
    if (!resource) return;
    if (user) {
      try {
        if (isBookmarked) {
          await removeFavorite(user, resource.id);
          setFavIds((ids) => ids.filter((x) => x !== resource.id));
        } else {
          await addFavorite(user, resource.id);
          setFavIds((ids) => [...ids, resource.id]);
        }
      } catch {
        /* ignore */
      }
      return;
    }
    toggleLocalFavorite(resource.id);
    setFavIds(getLocalFavoriteIds());
  };

  const sendReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource || !user) return;
    setReviewErr('');
    setReviewBusy(true);
    try {
      await submitReview(user, {
        resourceId: resource.id,
        rating: ratingIn,
        text: textIn,
        anonymous: anon,
      });
      setTextIn('');
    } catch (err: unknown) {
      setReviewErr(err instanceof Error ? err.message : 'Could not submit');
    } finally {
      setReviewBusy(false);
    }
  };

  const handleShare = useCallback(async () => {
    if (!resource || typeof window === 'undefined') return;
    const url = window.location.href;
    const shareData = { title: resource.name, text: resource.description, url };
    const nav = navigator as Navigator & { share?: (d: typeof shareData) => Promise<void> };
    const canShare =
      typeof nav.share === 'function' &&
      (!('canShare' in nav) || typeof nav.canShare !== 'function' || nav.canShare(shareData));
    if (canShare) {
      try {
        await nav.share!(shareData);
      } catch {
        await navigator.clipboard.writeText(url);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, [resource]);

  if (!resource) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center clt-glass rounded-3xl p-10 border border-border-light">
        <h1 className="font-display text-2xl font-bold mb-3">Resource not found</h1>
        <Button variant="accent" type="button" onClick={() => router.push('/resources')}>
          Back to hub
        </Button>
      </div>
    );
  }

  const cover = resourceCoverSrc(resource);
  const markers: MapMarker[] = resource.coordinates
    ? [{ id: resource.id, position: resource.coordinates, title: resource.name }]
    : [];
  const body =
    resource.longDescription ||
    [resource.description, resource.description, resource.eligibility].filter(Boolean).join('\n\n');

  return (
    <div className="max-w-6xl mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-accent mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 space-y-6">
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-surface-muted ring-1 ring-accent/15 shadow-md">
            {cover ? (
              <Image src={cover} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 66vw" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${resourceImageGradient(resource.category)}`} />
            )}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="accent">{resource.category}</Badge>
                {resource.featured && <Badge variant="warning">Featured</Badge>}
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">{resource.name}</h1>
              {resource.organizationName && (
                <p className="text-foreground-muted mt-1">{resource.organizationName}</p>
              )}
              {resource.website && (
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent mt-2 hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
            <div className="text-right text-sm text-foreground-secondary">
              <Clock className="w-4 h-4 inline mr-1" />
              {resource.availabilitySummary || resource.hours}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StarRatingDisplay value={avg} size="md" />
            <Button variant="outline" type="button" size="sm" onClick={() => setReviewsOpen(true)}>
              <MessageSquare className="w-4 h-4 mr-1" />
              View reviews ({reviews.length})
            </Button>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground-secondary">
            {body.split('\n\n').map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <section className="clt-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-border-light">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <span className="w-8 h-0.5 rounded-full bg-gold" />
              Community reviews
            </h2>
            {!user ? (
              <p className="text-sm text-foreground-secondary leading-relaxed">
                This public competition build does not use accounts. You can read reviews from the directory below.
                Favorites are saved on this device only. (Teams that operate a signed-in deployment can re-enable review
                posting through Firebase.)
              </p>
            ) : (
              <form onSubmit={sendReview} className="space-y-3">
                <StarRatingInput value={ratingIn} onChange={setRatingIn} disabled={reviewBusy} />
                <textarea
                  className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm min-h-[100px] focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--clt-blue)_18%,transparent)]"
                  placeholder="Share your experience…"
                  value={textIn}
                  onChange={(e) => setTextIn(e.target.value)}
                  required
                />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
                  Post anonymously
                </label>
                {reviewErr && <p className="text-sm text-error">{reviewErr}</p>}
                <Button type="submit" variant="primary" disabled={reviewBusy}>
                  Submit review
                </Button>
              </form>
            )}
          </section>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 self-start">
          <div className="flex gap-2">
            <Button
              variant={isBookmarked ? 'accent' : 'outline'}
              type="button"
              className="flex-1 gap-2"
              onClick={toggleBookmark}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" type="button" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          {!user && (
            <p className="text-xs text-foreground-muted leading-relaxed">
              Saves are stored in this browser (not synced). Clearing site data removes them.
            </p>
          )}

          <div className="h-[280px] rounded-3xl border-2 border-accent/20 overflow-hidden shadow-md ring-1 ring-gold/10">
            <GoogleMap
              markers={markers}
              height="100%"
              showUserLocation
              center={resource.coordinates || CHARLOTTE_AREA.center}
              zoom={resource.coordinates ? 14 : 11}
            />
          </div>

          <div className="clt-glass rounded-3xl p-5 space-y-4 text-sm border border-border-light">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(resource.address + ', ' + resource.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 items-start text-foreground hover:text-accent"
            >
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                {resource.address}, {resource.city}
              </span>
            </a>
            <a href={`tel:${resource.phone.replace(/\D/g, '')}`} className="flex gap-2 items-center text-foreground hover:text-accent">
              <Phone className="w-4 h-4" />
              {resource.phone}
            </a>
            <a href={`mailto:${resource.email}`} className="flex gap-2 items-center text-foreground hover:text-accent break-all">
              <Mail className="w-4 h-4 shrink-0" />
              {resource.email}
            </a>
            <Button
              variant="secondary"
              type="button"
              className="w-full gap-2"
              onClick={() =>
                window.open(
                  `https://maps.google.com/?q=${encodeURIComponent(resource.address + ', ' + resource.city)}`,
                  '_blank'
                )
              }
            >
              <Navigation className="w-4 h-4" />
              Directions
            </Button>
          </div>
        </aside>
      </div>

      <Modal isOpen={reviewsOpen} onClose={() => setReviewsOpen(false)} title="Reviews" size="lg">
        <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-foreground-secondary">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-border pb-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{r.authorLabel}</span>
                  <StarRatingDisplay value={r.rating} size="sm" />
                </div>
                <p className="text-sm text-foreground-secondary mt-2">{r.text}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
