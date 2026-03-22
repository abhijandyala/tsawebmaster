'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MapPin, Globe } from 'lucide-react';
import { SearchResult } from '@/lib/searchService';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: SearchResult[];
  onRemove: (id: string) => void;
}

const comparisonFields = [
  { key: 'category', label: 'Category' },
  { key: 'cost', label: 'Cost' },
  { key: 'walkIn', label: 'Walk-ins', format: (v: boolean | undefined) => v ? 'Yes' : v === false ? 'No' : '—' },
  { key: 'languages', label: 'Languages', format: (v: string[] | undefined) => v?.join(', ') || '—' },
  { key: 'eligibility', label: 'Eligibility', format: (v: string | undefined) => v || '—' },
  { key: 'rating', label: 'Rating', format: (v: number | undefined) => v ? `${v.toFixed(1)} stars` : '—' },
  { key: 'distance', label: 'Distance', format: (v: number | undefined) => v ? `${v.toFixed(1)} mi` : '—' },
];

export function CompareModal({ isOpen, onClose, resources, onRemove }: CompareModalProps) {
  if (!isOpen || resources.length === 0) return null;

  const getValue = (resource: SearchResult, key: string) => {
    return (resource as unknown as Record<string, unknown>)[key];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-surface border border-border shadow-xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Compare Resources
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-foreground-muted hover:text-foreground hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Resource headers */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `150px repeat(${resources.length}, 1fr)` }}>
              <div /> {/* Empty cell for labels */}
              {resources.map((resource) => (
                <div key={resource.id} className="relative p-4 bg-background border border-border">
                  <button
                    onClick={() => onRemove(resource.id)}
                    className="absolute top-2 right-2 p-1 text-foreground-muted hover:text-error transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="font-display font-semibold text-foreground pr-6 line-clamp-2">
                    {resource.name}
                  </h3>
                  <p className="text-xs text-foreground-muted mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{resource.location.address.split(',')[0]}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Comparison rows */}
            <div className="mt-4 divide-y divide-border">
              {comparisonFields.map((field) => (
                <div
                  key={field.key}
                  className="grid gap-4 py-3"
                  style={{ gridTemplateColumns: `150px repeat(${resources.length}, 1fr)` }}
                >
                  <div className="font-medium text-sm text-foreground-secondary">
                    {field.label}
                  </div>
                  {resources.map((resource) => {
                    const value = getValue(resource, field.key);
                    const formatted = field.format 
                      ? field.format(value as never)
                      : (value as string) || '—';
                    
                    return (
                      <div key={resource.id} className="text-sm text-foreground">
                        {formatted}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-4">Contact Information</h4>
              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${resources.length}, 1fr)` }}
              >
                {resources.map((resource) => (
                  <div key={resource.id} className="space-y-2">
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        {resource.phone}
                      </a>
                    )}
                    {resource.website && (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(resource.location.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <MapPin className="w-4 h-4" />
                      Directions
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
