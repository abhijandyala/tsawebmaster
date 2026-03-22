'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Heart } from 'lucide-react';
import { getFeaturedResources } from '@/data/resources';

const spotlightReasons: Record<string, { badge: string; reason: string; icon: React.ReactNode }> = {
  'loaves-fishes': {
    badge: 'Best for Emergency Food',
    reason: 'Largest emergency food network in Charlotte with 30+ pantry locations. No questions asked, same-day help available.',
    icon: <Heart className="w-4 h-4" />,
  },
  'crisis-assistance-ministry': {
    badge: 'Best for Crisis Support',
    reason: 'One-stop crisis center helping with rent, utilities, and essential needs. Served 70,000+ families last year.',
    icon: <Shield className="w-4 h-4" />,
  },
  'care-ring': {
    badge: 'Best for Healthcare Access',
    reason: 'Free primary care and medications for uninsured Charlotte residents. Walk-ins welcome, multilingual staff.',
    icon: <Star className="w-4 h-4" />,
  },
};

export function FeaturedResources() {
  const featured = getFeaturedResources().slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section id="featured" className="section-padding border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            Community Spotlights
          </h2>
          <p className="text-foreground-secondary max-w-xl mx-auto">
            Verified, trusted organizations that Charlotte residents rely on most. 
            Each has been selected for their impact and accessibility.
          </p>
        </motion.div>

        <div className="space-y-4">
          {featured.map((resource, index) => {
            const spotlight = spotlightReasons[resource.id] || {
              badge: 'Community Verified',
              reason: resource.description,
              icon: <Star className="w-4 h-4" />,
            };

            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/resource/${resource.id}`}
                  className="group block p-5 bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent">
                          {spotlight.icon}
                          {spotlight.badge}
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {resource.category}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-foreground-secondary mt-2 line-clamp-2">
                        {spotlight.reason}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-foreground-muted">
                        {resource.cost && (
                          <span className="text-success font-medium">{resource.cost}</span>
                        )}
                        {resource.walkIn && (
                          <span>Walk-ins welcome</span>
                        )}
                        <span>{resource.neighborhood || resource.city}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-sm text-foreground-muted">
            Looking for something specific?{' '}
            <button
              onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Search all resources
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
