'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Your resources</h1>
          <p className="text-foreground-secondary mt-2 text-sm">
            {isDemo && !user
              ? 'Demo mode: favorites are not saved. Recently viewed is stored on this device only.'
              : 'Saved favorites and resources you opened recently.'}
          </p>
        </div>
        <Button variant="accent" type="button" onClick={() => (window.location.href = '/request-resource')}>
          Request a resource →
        </Button>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-sm text-foreground-secondary">No favorites yet. Tap the bookmark on a resource page.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 relative">
              {favShown.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
              {!expandFav && favorites.length > 4 && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none rounded-b-xl"
                  aria-hidden
                />
              )}
            </div>
            {favorites.length > 4 && (
              <button
                type="button"
                className="mt-4 text-sm font-medium text-accent hover:underline"
                onClick={() => setExpandFav((e) => !e)}
              >
                {expandFav ? 'Show less' : 'View more'}
              </button>
            )}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Recently viewed</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-foreground-secondary">Open a resource to build this list.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 relative">
              {recentShown.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
              {!expandRecent && recent.length > 4 && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none rounded-b-xl"
                  aria-hidden
                />
              )}
            </div>
            {recent.length > 4 && (
              <button
                type="button"
                className="mt-4 text-sm font-medium text-accent hover:underline"
                onClick={() => setExpandRecent((e) => !e)}
              >
                {expandRecent ? 'Show less' : 'View more'}
              </button>
            )}
          </>
        )}
      </section>

      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/resources" className="text-sm text-accent hover:underline">
            ← Browse full resource hub
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
