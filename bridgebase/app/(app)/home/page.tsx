import { getFeaturedResources } from '@/data/resources';
import { HighlightsSection } from '@/components/home/HighlightsSection';
import { GlobalResourcesMap } from '@/components/maps/GlobalResourcesMap';

export default function HomePage() {
  const highlights = getFeaturedResources().slice(0, 3);

  return (
    <div className="space-y-14 max-w-6xl mx-auto">
      <section className="space-y-6">
        <div className="flex items-end gap-4">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-accent to-gold shrink-0" />
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">Highlights</h2>
            <p className="text-foreground-secondary mt-2 max-w-2xl text-sm leading-relaxed">
              Featured resources from our curated directory. Ratings grow as neighbors leave reviews in Firestore.
            </p>
          </div>
        </div>
        <HighlightsSection resources={highlights} />
      </section>

      <section className="space-y-6">
        <div className="flex items-end gap-4">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-gold to-accent shrink-0" />
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">City map</h2>
            <p className="text-foreground-secondary mt-2 max-w-2xl text-sm leading-relaxed">
              Your location centers the map when you allow it; otherwise we start in Charlotte. Tap a pin to open a
              resource.
            </p>
          </div>
        </div>
        <GlobalResourcesMap />
      </section>
    </div>
  );
}
