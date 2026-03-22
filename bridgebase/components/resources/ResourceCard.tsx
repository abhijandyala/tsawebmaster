'use client';

import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Resource } from '@/lib/types';

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link href={`/resource/${resource.id}`} className="block group">
      <article className="py-5 border-b border-border group-hover:border-primary/50 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs text-accent uppercase tracking-wider">
                {resource.category}
              </span>
              {resource.cost === 'Free' && (
                <span className="text-xs text-success">Free</span>
              )}
            </div>
            
            <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              {resource.name}
            </h3>
            
            <p className="text-sm text-foreground-secondary line-clamp-2 mb-2">
              {resource.description}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-foreground-muted">
              <MapPin className="w-3 h-3" />
              <span>{resource.neighborhood || resource.city}</span>
            </div>
          </div>
          
          <ArrowUpRight className="w-4 h-4 text-foreground-muted group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
        </div>
      </article>
    </Link>
  );
}
