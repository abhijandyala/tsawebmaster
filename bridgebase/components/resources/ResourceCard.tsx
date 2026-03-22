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
    <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
      <Link href={`/resource/${resource.id}`} className="block group">
        <article className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-background-alt">
            {cover ? (
              <Image
                src={cover}
                alt=""
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${resourceImageGradient(resource.category)} flex items-end p-4`}
              >
                <span className="text-white/95 font-display text-lg font-semibold drop-shadow-sm line-clamp-2">
                  {title}
                </span>
              </div>
            )}
            {cover && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            )}
          </div>
          <div className="p-4 flex flex-col flex-1 gap-2">
            <div className="flex justify-between gap-3 items-start">
              <div className="min-w-0">
                {cover && (
                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {title}
                  </h3>
                )}
                {org && (
                  <p className="text-xs text-foreground-muted mt-0.5 line-clamp-1">{org}</p>
                )}
                {!org && !cover && (
                  <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                )}
              </div>
              {when && (
                <p className="text-xs text-foreground-secondary text-right shrink-0 max-w-[40%] leading-snug">
                  {when}
                </p>
              )}
            </div>
            <p className="text-sm text-foreground-secondary line-clamp-3 flex-1">{resource.description}</p>
            <div className="flex justify-end pt-1">
              <StarRatingDisplay value={rating} size="sm" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
