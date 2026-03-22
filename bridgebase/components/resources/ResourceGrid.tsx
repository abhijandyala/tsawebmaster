'use client';

import { motion } from 'framer-motion';
import { ResourceCard } from './ResourceCard';
import { Resource } from '@/lib/types';

interface ResourceGridProps {
  resources: Resource[];
  onClearFilters: () => void;
}

export function ResourceGrid({ resources, onClearFilters }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-secondary mb-4">No resources found</p>
        <button 
          onClick={onClearFilters}
          className="text-primary hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-x-8">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <ResourceCard resource={resource} />
        </motion.div>
      ))}
    </div>
  );
}
