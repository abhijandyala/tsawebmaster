'use client';

import { Resource } from '@/lib/types';
import { HubResourceGrid } from '@/components/resources/HubResourceGrid';

export function HighlightsSection({ resources }: { resources: Resource[] }) {
  return <HubResourceGrid resources={resources} />;
}
