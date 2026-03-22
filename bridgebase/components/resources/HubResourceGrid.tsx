'use client';

import { motion } from 'framer-motion';
import { ResourceCard } from './ResourceCard';
import { Resource } from '@/lib/types';

export function HubResourceGrid({
  resources,
  ratingsById,
}: {
  resources: Resource[];
  ratingsById?: Record<string, number>;
}) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12 text-foreground-secondary text-sm">No resources match.</div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
        >
          <ResourceCard resource={resource} rating={ratingsById?.[resource.id] ?? 0} />
        </motion.div>
      ))}
    </div>
  );
}
