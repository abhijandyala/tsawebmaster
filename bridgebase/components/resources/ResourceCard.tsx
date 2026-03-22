'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Resource } from '@/lib/types';
import { resourceCoverSrc, resourceImageGradient } from '@/lib/resourceImage';
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      <Link href={`/resource/${resource.id}`} className="block group">
        <article className="clt-card overflow-hidden h-full flex flex-col rounded-2xl bg-surface">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
            {cover ? (
              <Image
                src={cover}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${resourceImageGradient(resource.category)} flex items-end p-5`}
              >
                <span className="font-display text-lg font-bold text-white drop-shadow-md line-clamp-2 leading-snug">
                  {title}
                </span>
              </div>
            )}
            {cover && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#23361D]/55 via-transparent to-[#447CB3]/10 pointer-events-none" />
            )}
          </div>

          <div className="p-5 flex flex-col flex-1 gap-3 border-t border-border-light bg-gradient-to-b from-surface to-surface-muted/40">
            <div className="flex justify-between gap-3 items-start">
              <div className="min-w-0">
                {cover && (
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {title}
                  </h3>
                )}
                {org && <p className="text-xs font-medium text-foreground-muted mt-1 line-clamp-1">{org}</p>}
                {!org && !cover && (
                  <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                )}
              </div>
              {when && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-accent shrink-0 max-w-[42%] text-right leading-snug">
                  {when}
                </p>
              )}
            </div>
            <p className="text-sm text-foreground-secondary line-clamp-3 leading-relaxed flex-1">{resource.description}</p>
            <div className="flex justify-between items-center pt-1 border-t border-border-light/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Community</span>
              <StarRatingDisplay value={rating} size="sm" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
