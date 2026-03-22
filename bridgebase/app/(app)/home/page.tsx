import { getFeaturedResources } from '@/data/resources';
import { HighlightsSection } from '@/components/home/HighlightsSection';
import { GlobalResourcesMap } from '@/components/maps/GlobalResourcesMap';

export default function HomePage() {
  const highlights = getFeaturedResources().slice(0, 3);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <section>
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Highlights</h2>
        <p className="text-sm text-foreground-secondary mb-6 max-w-2xl">
          Three standout resources from our curated directory. Ratings update as the community adds reviews.
        </p>
        <HighlightsSection resources={highlights} />
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">All resources on the map</h2>
        <p className="text-sm text-foreground-secondary mb-4">
          Your location centers the map when allowed; otherwise we start in Charlotte. Tap a marker to open a resource.
        </p>
        <GlobalResourcesMap />
      </section>
    </div>
  );
}
