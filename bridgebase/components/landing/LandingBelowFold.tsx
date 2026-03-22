'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Bookmark,
  ChevronDown,
  HeartHandshake,
  Languages,
  LayoutGrid,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { LANDING_REGIONS } from './landingRegions';

/**
 * Optional: add `public/landing/community-hero.jpg` and `public/landing/metro-wide.jpg`, then point these constants there.
 */
const LANDING_IMG_COMMUNITY = '/charlotte_nc.png';
const LANDING_IMG_METRO = '/charlotte_nc.png';

const viewport = { once: true, amount: 0.2, margin: '-40px' as const };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const features = [
  {
    title: 'Curated resource hub',
    description:
      'Food, housing, health, jobs, transit, and crisis support — organized so you can compare options quickly.',
    icon: LayoutGrid,
  },
  {
    title: 'Personalized help',
    description:
      'A short guided flow learns what you need, then surfaces Charlotte-area services that fit your situation.',
    icon: Sparkles,
  },
  {
    title: 'Save & plan ahead',
    description:
      'Bookmark favorites, track recently viewed places, and keep a printable help plan for appointments and referrals.',
    icon: Bookmark,
  },
  {
    title: 'Built for real neighborhoods',
    description:
      'Maps, hours, eligibility notes, and community-sourced signals where available — fewer dead ends, clearer next steps.',
    icon: MapPin,
  },
  {
    title: 'Multilingual-friendly',
    description:
      'Language preferences help you discover resources that can communicate in the language you use most.',
    icon: Languages,
  },
  {
    title: 'Try before you sign in',
    description:
      'Demo mode lets residents and partners explore the hub without an account — then sign in when you want sync.',
    icon: Users,
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
    <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl ring-1 ring-black/10 dark:ring-white/10 shadow-2xl">
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
        className="absolute inset-0 bg-gradient-to-tr from-[#23361D]/55 via-transparent to-[#447CB3]/35"
        aria-hidden
      />
    </div>
  );
}

export function LandingBelowFold() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative bg-background text-foreground">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32 space-y-24 sm:space-y-28">
        {/* Purpose + story */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-8 sm:pt-4"
        >
          <motion.div variants={fadeUp} transition={{ type: 'spring', stiffness: 120, damping: 22 }}>
            <p className="text-sm font-semibold tracking-wide text-accent uppercase mb-3">Why we exist</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance mb-6">
              Cut through the noise when you need help
            </h2>
            <p className="text-foreground-secondary leading-relaxed text-base sm:text-lg mb-5">
              Charlotte Connect brings trusted, local resources into one calm, searchable place. Instead of chasing
              outdated PDFs or dozens of disconnected sites, neighbors, caseworkers, and families can discover what
              actually serves Mecklenburg, Union, Cabarrus, and nearby communities — with clear paths to call, visit, or
              get personalized next steps.
            </p>
            <p className="text-foreground-secondary leading-relaxed text-sm sm:text-base">
              We focus on practical access: who helps, where they are, what to expect, and how to prepare — so fewer
              people bounce between dead links when time or safety is tight.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            className="relative"
          >
            <div className="will-change-transform">
              <SectionImage
                src="/charlotte_nc.png"
                alt="Charlotte skyline and city view"
                objectPosition="center 35%"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.12 }}
              className="absolute -bottom-5 -left-2 sm:left-4 max-w-[min(100%,280px)] rounded-2xl bg-background/90 backdrop-blur-xl border border-border shadow-xl p-4 flex items-start gap-3"
            >
              <HeartHandshake className="w-9 h-9 text-accent shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-display font-bold text-sm">Neighbor-first</p>
                <p className="text-xs text-foreground-secondary mt-1 leading-snug">
                  Designed with dignity — no shame, no clutter, just clear options.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="space-y-10"
        >
          <motion.div variants={fadeUp} transition={{ type: 'spring', stiffness: 120, damping: 22 }} className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-accent uppercase mb-3">What you can do</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Tools that meet people where they are
            </h2>
            <p className="text-foreground-secondary mt-4 text-base leading-relaxed">
              From a quick search to a saved plan for tomorrow&apos;s appointment — every feature is meant to reduce
              friction between needing help and getting it.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ title, description, icon: Icon }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                transition={{ type: 'spring', stiffness: 140, damping: 22, delay: reduceMotion ? 0 : i * 0.04 }}
                whileHover={reduceMotion ? undefined : { y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                className="group relative rounded-2xl border border-border bg-surface-muted/40 dark:bg-surface-muted/20 p-6 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/8 via-transparent to-primary/10 pointer-events-none"
                  aria-hidden
                />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent mb-4">
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-foreground-secondary leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Community + second image band */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-stretch"
        >
          <motion.div
            variants={fadeUp}
            className="lg:col-span-2 order-2 lg:order-1"
            style={{ y: reduceMotion ? 0 : undefined }}
          >
            <motion.div
              initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{ type: 'spring', stiffness: 100, damping: 22 }}
            >
              <SectionImage
                src={LANDING_IMG_COMMUNITY}
                alt="Neighbors and community support in the Charlotte region"
                objectPosition="70% center"
              />
            </motion.div>
          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-3 order-1 lg:order-2 space-y-6">
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">Community impact</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Stronger when local knowledge is easy to share
            </h2>
            <p className="text-foreground-secondary leading-relaxed text-base">
              Schools, faith groups, clinics, libraries, and front-line nonprofits all hear the same question: &ldquo;Who
              can actually help?&rdquo; Charlotte Connect turns scattered answers into one shareable hub — so volunteers
              and professionals spend less time re-explaining lists, and residents spend less time guessing.
            </p>
            <ul className="space-y-4">
              {[
                'Fewer wrong turns to closed programs or wrong counties.',
                'Clearer handoffs between informal help (friends & family) and formal services.',
                'A single link caseworkers can text after a meeting — with maps and hours attached.',
              ].map((line, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: reduceMotion ? 0 : 0.08 * idx, type: 'spring', stiffness: 200, damping: 26 }}
                  className="flex gap-3 text-foreground-secondary text-sm sm:text-base leading-relaxed"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold shadow-[0_0_12px_rgba(187,184,87,0.45)]" />
                  {line}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* Coverage */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="rounded-[2rem] border border-border bg-gradient-to-br from-surface-muted/60 via-background to-surface-muted/40 p-8 sm:p-12 overflow-hidden relative"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <motion.div variants={fadeUp} className="relative max-w-2xl mb-10">
            <p className="text-sm font-semibold tracking-wide text-accent uppercase mb-3">Where we focus</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance flex flex-wrap items-center gap-2">
              <MapPin className="w-8 h-8 text-accent shrink-0" aria-hidden />
              Communities we serve
            </h2>
            <p className="text-foreground-secondary mt-4 leading-relaxed">
              Coverage centers on Charlotte and surrounding towns across Mecklenburg, Union, and Cabarrus — including
              Lake Norman and key suburbs partners ask about most often.
            </p>
          </motion.div>
          <div className="relative grid md:grid-cols-3 gap-8">
            {LANDING_REGIONS.map((region, ri) => (
              <motion.div
                key={region.id}
                variants={fadeUp}
                transition={{ delay: reduceMotion ? 0 : ri * 0.06 }}
                className="space-y-3"
              >
                <h3 className="font-display font-bold text-lg text-foreground">{region.title}</h3>
                <p className="text-xs text-foreground-muted leading-snug">{region.blurb}</p>
                <ul className="flex flex-wrap gap-2">
                  {region.places.map((place, pi) => (
                    <motion.li
                      key={place}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        delay: reduceMotion ? 0 : 0.04 * pi + 0.06 * ri,
                        type: 'spring',
                        stiffness: 300,
                        damping: 22,
                      }}
                    >
                      <span className="inline-flex items-center rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground-secondary">
                        {place}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Optional wide image strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          className="relative rounded-3xl overflow-hidden ring-1 ring-border aspect-[21/9] min-h-[160px] max-h-[320px]"
        >
          <Image
            src={LANDING_IMG_METRO}
            alt="Charlotte metro area — neighborhoods and growth"
            fill
            className="object-cover object-[center_25%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1210]/75 via-[#0d1210]/25 to-transparent" aria-hidden />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 sm:px-12 max-w-lg">
            <p className="text-white/90 font-display text-xl sm:text-2xl font-bold text-balance drop-shadow-sm">
              From Uptown to Cabarrus — one connective map of care.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function LandingScrollHint() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="mt-8 flex flex-col items-center gap-1 text-[#D4D8EC]/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      aria-hidden
    >
      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Explore</span>
      <motion.span
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={reduceMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-6 h-6 opacity-90" />
      </motion.span>
    </motion.div>
  );
}
