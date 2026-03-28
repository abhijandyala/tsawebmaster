import Link from 'next/link';
import { getFeaturedResources } from '@/data/resources';
import { HighlightsSection } from '@/components/home/HighlightsSection';
import { GlobalResourcesMap } from '@/components/maps/GlobalResourcesMap';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export default function HomePage() {
  const highlights = getFeaturedResources().slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-20 max-w-6xl mx-auto">
      <section className="space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="h-12 w-1 rounded-full bg-gradient-to-b from-accent to-gold shrink-0 mt-1" aria-hidden />
            <div>
              <SectionEyebrow className="mb-3">Spotlight</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-[2.25rem] font-semibold text-foreground tracking-tight text-balance leading-tight">
                Highlights from the directory
              </h2>
              <p className="text-foreground-secondary mt-3 text-sm sm:text-[0.9375rem] leading-relaxed">
                Three resources we feature right now — nonprofits and programs neighbors rely on. Browse the{' '}
                <Link href="/resources" className="font-semibold text-accent hover:underline underline-offset-2">
                  full hub
                </Link>{' '}
                to search, filter, and share custom lists.
              </p>
            </div>
          </div>
        </div>
        <HighlightsSection resources={highlights} />
      </section>

      <section className="space-y-7">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="h-12 w-1 rounded-full bg-gradient-to-b from-gold to-accent shrink-0 mt-1" aria-hidden />
          <div>
            <SectionEyebrow className="mb-3">Map</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-[2.25rem] font-semibold text-foreground tracking-tight text-balance leading-tight">
              Explore by place
            </h2>
            <p className="text-foreground-secondary mt-3 text-sm sm:text-[0.9375rem] leading-relaxed max-w-2xl">
              Allow location to center on you, or start in Charlotte. Tap a pin to open the full listing — hours,
              contact, and eligibility on one screen.
            </p>
          </div>
        </div>
        <GlobalResourcesMap />
      </section>
    </div>
  );
}
