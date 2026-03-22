'use client';

import { useRouter } from 'next/navigation';
import { resources } from '@/data/resources';
import { HubResourceGrid } from '@/components/resources/HubResourceGrid';
import { Button } from '@/components/ui/Button';

export default function ResourcesHubPage() {
  const router = useRouter();
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Resource hub</h1>
          <p className="text-foreground-secondary mt-2 max-w-xl text-sm">
            Browse trusted Charlotte-area resources. Open a card for full details, map, and reviews.
          </p>
        </div>
        <Button variant="accent" type="button" className="shrink-0" onClick={() => router.push('/request-resource')}>
          Need another resource? Request it →
        </Button>
      </div>
      <HubResourceGrid resources={resources} />
    </div>
  );
}
