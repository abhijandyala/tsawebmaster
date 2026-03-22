'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { resources } from '@/data/resources';
import { HubResourceGrid } from '@/components/resources/HubResourceGrid';
import { Button } from '@/components/ui/Button';

export default function ResourcesHubPage() {
  const router = useRouter();
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-1.5 rounded-full bg-gradient-to-b from-accent via-gold to-primary shrink-0 mt-1" />
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl font-bold text-foreground tracking-tight"
            >
              Resource hub
            </motion.h1>
            <p className="text-foreground-secondary mt-3 max-w-xl text-sm leading-relaxed">
              Curated Charlotte-area support — food, housing, health, jobs, and crisis help. Cards open full detail,
              map, and reviews.
            </p>
          </div>
        </div>
        <Button variant="accent" type="button" className="shrink-0 shadow-md" onClick={() => router.push('/request-resource')}>
          Need something else? Request a resource →
        </Button>
      </div>
      <HubResourceGrid resources={resources} />
    </div>
  );
}
