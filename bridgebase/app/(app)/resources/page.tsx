import { Suspense } from 'react';
import { ResourcesHubClient } from './ResourcesHubClient';

function HubFallback() {
  return (
    <div className="max-w-6xl mx-auto py-24 flex flex-col items-center gap-3 text-foreground-muted text-sm">
      <div className="h-9 w-9 rounded-2xl border-2 border-accent border-t-transparent animate-spin" aria-hidden />
      Loading resource hub…
    </div>
  );
}

export default function ResourcesHubPage() {
  return (
    <Suspense fallback={<HubFallback />}>
      <ResourcesHubClient />
    </Suspense>
  );
}
