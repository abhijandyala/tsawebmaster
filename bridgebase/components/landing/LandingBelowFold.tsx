'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { HeartHandshake, MapPin } from 'lucide-react';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { LANDING_REGIONS } from './landingRegions';

const LANDING_IMG_STORY = '/charlotte_nc.png';
const LANDING_IMG_COMMUNITY = '/charlotte_nc2.jpg';
const LANDING_IMG_METRO = '/charlotte_nc3.webp';

const viewport = { once: true, amount: 0.2, margin: '-40px' as const };

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const features = [
  {
    title: 'Curated directory',
    description:
      'Food, housing, health, jobs, transit, and crisis support in one searchable hub — compare eligibility, hours, and formats without opening ten tabs.',
  },
  {
    title: 'Guided help',
    description:
      'A short questionnaire learns what you need, then points to Charlotte-area options that fit — fewer dead ends when stress is high.',
  },
  {
    title: 'Save and plan',
    description:
      'Bookmark listings on this device, revisit recent places, and keep a printable plan for appointments or handoffs to a caseworker.',
  },
  {
    title: 'Maps and context',
    description:
      'Pins, neighborhoods, and plain-language notes on what to expect before you call or walk in.',
  },
  {
    title: 'Languages',
    description:
      'Translate the site from the header when English isn’t the easiest read for you or your family.',
  },
  {
    title: 'No account wall',
    description:
      'The directory and tools stay open to everyone. Nothing to sign up for just to see what’s available.',
  },
];

function SectionImage({
  src,
  alt,
  objectPosition,
  priority,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-xl ring-1 ring-black/[0.08] dark:ring-white/[0.08] shadow-[0_24px_60px_rgba(35,54,29,0.12)]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ objectPosition: objectPosition ?? 'center' }}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
      />
      <div
        className="absolute inset-0 bg-gradient-to-tr from-[#23361D]/45 via-transparent to-[#447CB3]/25"
        aria-hidden
      />
    </div>
  );
}

export function LandingBelowFold() {

  return (
    <div className="relative bg-background text-foreground">
      <div className="relative max-w-6xl mx-auto w-full clt-page-x pb-24 sm:pb-32 space-y-28 sm:space-y-36">
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center pt-10 sm:pt-6"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}>
            <SectionEyebrow className="mb-4">Why we built this</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-[2.15rem] font-semibold tracking-tight text-balance mb-6 leading-tight">
              Help shouldn’t depend on who you know first
            </h2>
            <p className="text-foreground-secondary leading-relaxed text-[1.05rem] mb-5">
              Charlotte Connect gathers trusted, local resources into one calm place. Neighbors, families, and people in
              front-line roles can find what serves Mecklenburg, Union, Cabarrus, and nearby towns — with clear next
              steps instead of stale PDFs and broken links.
            </p>
            <p className="text-foreground-secondary leading-relaxed text-sm sm:text-base">
              We care about practical access: who helps, where they are, what to bring, and how to get there — so fewer
              people spin their wheels when time or safety matters.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }} className="relative">
            <SectionImage src={LANDING_IMG_STORY} alt="Charlotte skyline and city view" objectPosition="center 35%" />
            <div className="absolute -bottom-4 -left-1 sm:left-2 max-w-[min(100%,272px)] rounded-lg bg-surface/95 backdrop-blur-md border border-border shadow-lg p-4 flex items-start gap-3">
              <HeartHandshake className="w-8 h-8 text-accent shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-display font-semibold text-sm tracking-tight">Dignity by default</p>
                <p className="text-xs text-foreground-secondary mt-1 leading-snug">
                  Straightforward language, no clutter, no guilt — just options.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="grid lg:grid-cols-12 gap-12 lg:gap-16"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-4 lg:pt-2"
          >
            <SectionEyebrow className="mb-4">What you can do here</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-[2.15rem] font-semibold tracking-tight text-balance leading-tight">
              Built for real days, not demo screenshots
            </h2>
            <p className="text-foreground-secondary mt-5 text-sm sm:text-base leading-relaxed">
              The same tasks people actually run — find food tonight, confirm a clinic takes walk-ins, text one link to
              someone who’s overwhelmed.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-8 space-y-0 divide-y divide-border">
            {features.map(({ title, description }, i) => (
              <div key={title} className="flex gap-5 sm:gap-8 py-9 first:pt-0">
                <span
                  className="font-display text-3xl sm:text-4xl tabular-nums text-accent/[0.22] dark:text-accent/[0.35] shrink-0 w-12 sm:w-14 text-right leading-none pt-0.5"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 pt-1">
                  <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-sm sm:text-[0.9375rem] text-foreground-secondary leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="grid lg:grid-cols-5 gap-12 lg:gap-14 items-stretch"
        >
          <motion.div variants={fadeUp} className="lg:col-span-2 order-2 lg:order-1">
            <SectionImage
              src={LANDING_IMG_COMMUNITY}
              alt="Neighbors and community support in the Charlotte region"
              objectPosition="70% center"
            />
          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-3 order-1 lg:order-2 space-y-5">
            <SectionEyebrow>Community impact</SectionEyebrow>
            <h2 className="font-display text-3xl sm:text-[2.15rem] font-semibold tracking-tight text-balance leading-tight">
              One link beats a dozen screenshots
            </h2>
            <p className="text-foreground-secondary leading-relaxed text-[1.02rem]">
              Schools, clinics, libraries, and nonprofits all get the same question: who can help, really? Charlotte
              Connect turns scattered answers into something you can share — so volunteers spend less time re-typing
              lists, and residents spend less time guessing.
            </p>
            <ul className="space-y-3.5 pt-2">
              {[
                'Fewer wrong turns to programs that are closed or out of county.',
                'Clearer handoffs between informal help and formal services.',
                'A single URL to text after a meeting — with maps and hours in one place.',
              ].map((line, idx) => (
                <li key={idx} className="flex gap-3 text-foreground-secondary text-sm sm:text-[0.9375rem] leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="rounded-xl border border-border bg-surface p-6 sm:p-9 lg:p-11 shadow-[var(--shadow-card)] relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/[0.07] blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden />

          <div className="relative z-[1] max-w-3xl mb-10 sm:mb-12">
            <motion.div variants={fadeUp}>
              <SectionEyebrow className="mb-4">Coverage</SectionEyebrow>
              <h2 className="font-display text-3xl sm:text-[2.15rem] font-semibold tracking-tight text-balance flex flex-wrap items-center gap-3 leading-tight">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent border border-accent/20">
                  <MapPin className="w-5 h-5" aria-hidden />
                </span>
                Where we focus
              </h2>
              <p className="text-foreground-secondary mt-4 leading-relaxed text-sm sm:text-base">
                Mecklenburg, Union, and Cabarrus — plus the lake communities and I‑77 / I‑85 corridors partners ask
                about most.
              </p>
            </motion.div>
          </div>

          <div className="relative z-[1] grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 items-stretch">
            {LANDING_REGIONS.map((region) => (
              <motion.article
                key={region.id}
                variants={fadeUp}
                className="flex min-h-0 flex-col rounded-lg border border-border bg-background/80 p-5 sm:p-6 shadow-[0_1px_0_rgba(35,54,29,0.04)]"
              >
                <header className="border-b border-border/90 pb-4 mb-4">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-foreground tracking-tight leading-snug text-balance">
                    {region.title}
                  </h3>
                  <p className="text-[13px] text-foreground-muted leading-relaxed mt-2">{region.blurb}</p>
                </header>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted/90 mb-2.5">
                  Places
                </p>
                <ul className="flex flex-col gap-2 flex-1 min-h-0">
                  {region.places.map((place) => (
                    <li key={place}>
                      <span className="flex w-full items-center rounded-md border border-border/90 bg-surface px-3 py-2 text-sm font-medium text-foreground-secondary leading-snug">
                        {place}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative rounded-xl overflow-hidden ring-1 ring-black/[0.06] dark:ring-white/[0.08] aspect-[21/9] min-h-[180px] max-h-[320px]"
        >
          <Image
            src={LANDING_IMG_METRO}
            alt="Charlotte metro area — neighborhoods and growth"
            fill
            className="object-cover object-[center_28%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1210]/88 via-[#0d1210]/4 to-transparent sm:from-[#0d1210]/78 sm:via-[#0d1210]/20" aria-hidden />
          <figcaption className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:pl-12 sm:pr-8 pb-7 sm:pb-0 max-w-[min(100%,26rem)]">
            <p className="text-white font-display text-[1.05rem] sm:text-xl font-semibold text-balance tracking-tight leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              From Uptown to Cabarrus — one map-minded view of where care lives.
            </p>
          </figcaption>
        </motion.figure>
      </div>
    </div>
  );
}

export function LandingScrollHint() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="mt-10 flex flex-col items-center gap-1.5 text-[#D4D8EC]/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      aria-hidden
    >
      <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#D4D8EC]/55">Scroll</span>
      <motion.span
        animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
        transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-[#D4D8EC]/50 text-lg leading-none"
      >
        ↓
      </motion.span>
    </motion.div>
  );
}
