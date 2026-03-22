'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useDemo } from '@/contexts/demo-context';
import { resources } from '@/data/resources';
import { listFavoriteIds, listRecentIds } from '@/lib/firestoreUser';
import { getLocalRecentIds } from '@/lib/localRecent';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { Button } from '@/components/ui/Button';

function byIds(ids: string[]) {
  const map = new Map(resources.map((r) => [r.id, r]));
  return ids.map((id) => map.get(id)).filter(Boolean) as typeof resources;
}

export default function YourResourcesPage() {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const [favIds, setFavIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [expandFav, setExpandFav] = useState(false);
  const [expandRecent, setExpandRecent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user) {
        const [f, r] = await Promise.all([listFavoriteIds(user), listRecentIds(user, 20)]);
        if (!cancelled) {
          setFavIds(f);
          setRecentIds(r);
        }
      } else {
        setFavIds([]);
        setRecentIds(getLocalRecentIds());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const favorites = useMemo(() => byIds(favIds), [favIds]);
  const recent = useMemo(() => byIds(recentIds), [recentIds]);
  const favShown = expandFav ? favorites : favorites.slice(0, 4);
  const recentShown = expandRecent ? recent : recent.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-1.5 rounded-full bg-gradient-to-b from-gold to-accent shrink-0 mt-1" />
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Your resources</h1>
            <p className="text-foreground-secondary mt-3 text-sm max-w-lg leading-relaxed">
              {isDemo && !user
                ? 'Demo: favorites are not synced. Recent views are stored on this device only.'
                : 'Favorites sync to your account. Recently opened resources appear below.'}
            </p>
          </div>
        </div>
        <Button variant="accent" type="button" onClick={() => (window.location.href = '/request-resource')}>
          Request a resource →
        </Button>
      </div>

      <section className="clt-glass rounded-3xl p-6 sm:p-8 border border-border-light">
        <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Favorites
        </h2>
        {favorites.length === 0 ? (
          <p className="text-sm text-foreground-secondary">Save resources from the bookmark on any detail page.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-6 relative">
              {favShown.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
              {!expandFav && favorites.length > 4 && (
                <div className="fade-overlay-bottom absolute bottom-0 left-0 right-0 h-28 rounded-b-2xl pointer-events-none" />
              )}
            </div>
            {favorites.length > 4 && (
              <button
                type="button"
                className="mt-6 text-sm font-bold text-accent hover:underline"
                onClick={() => setExpandFav((e) => !e)}
              >
                {expandFav ? 'Show less' : 'View more'}
              </button>
            )}
          </>
        )}
      </section>

      <section className="clt-glass rounded-3xl p-6 sm:p-8 border border-border-light">
        <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold" />
          Recently viewed
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-foreground-secondary">Open any resource to populate this list.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-6 relative">
              {recentShown.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
              {!expandRecent && recent.length > 4 && (
                <div className="fade-overlay-bottom absolute bottom-0 left-0 right-0 h-28 rounded-b-2xl pointer-events-none" />
              )}
            </div>
            {recent.length > 4 && (
              <button
                type="button"
                className="mt-6 text-sm font-bold text-accent hover:underline"
                onClick={() => setExpandRecent((e) => !e)}
              >
                {expandRecent ? 'Show less' : 'View more'}
              </button>
            )}
          </>
        )}
      </section>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link href="/resources" className="text-sm font-semibold text-accent hover:underline">
          ← Full resource hub
        </Link>
      </motion.div>
    </div>
  );
}
