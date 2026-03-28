'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Resource } from '@/lib/types';
import { resourceCoverSrc, resourceImageGradient, resourceCategoryStripe } from '@/lib/resourceImage';
import { StarRatingDisplay } from '@/components/ui/StarRating';

interface ResourceCardProps {
  resource: Resource;
  rating?: number;
}

export function ResourceCard({ resource, rating = 0 }: ResourceCardProps) {
  const cover = resourceCoverSrc(resource);
  const title = resource.name;
  const org = resource.organizationName;
  const when = resource.availabilitySummary || resource.hours;
  const stripe = resourceCategoryStripe(resource.category);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ type: 'tween', duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/resource/${resource.id}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl">
        <article
          className={`clt-card overflow-hidden h-full flex flex-col rounded-xl bg-surface border-l-4 ${stripe} shadow-[var(--shadow-card)]`}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
            {cover ? (
              <Image
                src={cover}
                alt=""
                fill
                className="object-cover transition-transform duration-[420ms] ease-out group-hover:scale-[1.02]"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${resourceImageGradient(resource.category)} flex items-end p-5`}
              >
                <span className="font-display text-lg font-semibold text-white/95 tracking-tight drop-shadow-sm line-clamp-2 leading-snug">
                  {title}
                </span>
              </div>
            )}
            {cover && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#23361D]/50 via-transparent to-transparent pointer-events-none" />
            )}
            <span className="absolute left-3 top-3 rounded-md bg-[#0d1210]/72 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/95 backdrop-blur-sm">
              {resource.category}
            </span>
          </div>

          <div className="p-5 flex flex-col flex-1 gap-3 border-t border-border-light/90 bg-surface">
            <div className="flex justify-between gap-3 items-start">
              <div className="min-w-0">
                {cover && (
                  <h3 className="font-display text-lg font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors duration-200 line-clamp-2">
                    {title}
                  </h3>
                )}
                {org && <p className="text-xs text-foreground-muted mt-1 line-clamp-1">{org}</p>}
                {!org && !cover && <h3 className="font-display text-lg font-semibold text-foreground tracking-tight">{title}</h3>}
              </div>
              {when && (
                <p className="text-[11px] font-medium text-foreground-muted shrink-0 max-w-[44%] text-right leading-snug">
                  {when}
                </p>
              )}
            </div>
            <p className="text-sm text-foreground-secondary line-clamp-3 leading-relaxed flex-1">{resource.description}</p>
            <div className="flex justify-between items-center pt-2 border-t border-border-light/70">
              <span className="text-xs font-medium text-foreground-secondary">{resource.cost} · {resource.format}</span>
              <StarRatingDisplay value={rating} size="sm" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
