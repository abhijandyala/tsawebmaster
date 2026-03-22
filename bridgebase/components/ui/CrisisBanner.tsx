'use client';

import { useState } from 'react';
import { AlertTriangle, Phone, X, Heart, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrisisBannerProps {
  variant?: 'prominent' | 'subtle';
  showEmergencyResources?: boolean;
  onDismiss?: () => void;
}

const crisisResources = [
  {
    name: '988 Suicide & Crisis Lifeline',
    number: '988',
    description: 'Free, confidential support 24/7',
    urgent: true,
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free crisis counseling via text',
    urgent: false,
  },
  {
    name: 'NC 211',
    number: '211',
    description: 'Connect to local help 24/7',
    urgent: false,
  },
];

export function CrisisBanner({ 
  variant = 'prominent', 
  showEmergencyResources = false,
  onDismiss 
}: CrisisBannerProps) {
  const [isExpanded, setIsExpanded] = useState(showEmergencyResources);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (variant === 'subtle') {
    return (
      <div className="bg-warning-surface/50 border border-warning/30 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 text-warning flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Need immediate support?</span>{' '}
            <a href="tel:988" className="text-primary hover:underline font-medium">
              Call 988
            </a>{' '}
            or{' '}
            <a href="tel:911" className="text-primary hover:underline font-medium">
              911
            </a>{' '}
            for emergencies
          </p>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-foreground-muted hover:text-foreground p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-warning-surface to-error-surface border-l-4 border-warning p-4 mb-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">
              If you&apos;re in crisis or need immediate help
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-3">
            <a 
              href="tel:911" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-error text-white font-medium hover:bg-error/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 911
            </a>
            <a 
              href="tel:988" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              988 Crisis Line
            </a>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:underline font-medium"
          >
            {isExpanded ? 'Hide' : 'Show'} more crisis resources
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3"
              >
                {crisisResources.map((resource) => (
                  <div 
                    key={resource.name}
                    className="flex items-start gap-3 p-3 bg-white/50 dark:bg-black/10"
                  >
                    <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{resource.name}</p>
                      <p className="text-sm text-primary font-medium">{resource.number}</p>
                      <p className="text-sm text-foreground-secondary">{resource.description}</p>
                    </div>
                  </div>
                ))}
                
                <a 
                  href="https://www.nc211.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  More resources at NC211.org
                  <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={handleDismiss}
          className="text-foreground-muted hover:text-foreground p-1 flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
