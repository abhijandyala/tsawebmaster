import Link from 'next/link';
import { FileCheck, FileText, ExternalLink } from 'lucide-react';

const SOURCES = [
  {
    title: 'Charlotte-Mecklenburg quality of life & services',
    url: 'https://charlottenc.gov/',
    note: 'Official city portal for programs and public information.',
  },
  {
    title: 'Mecklenburg County government',
    url: 'https://www.mecknc.gov/',
    note: 'County-level health, social services, and public resources.',
  },
  {
    title: '211 United Way (NC)',
    url: 'https://www.nc211.org/',
    note: 'Crisis and referral line directory used for helpline-style guidance.',
  },
  {
    title: 'Next.js documentation',
    url: 'https://nextjs.org/docs',
    note: 'Application framework (routing, rendering, deployment).',
  },
  {
    title: 'React documentation',
    url: 'https://react.dev/',
    note: 'UI library used for interactive components.',
  },
  {
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com/docs',
    note: 'Utility-first styling approach for layout and theme tokens.',
  },
  {
    title: 'Framer Motion',
    url: 'https://www.framer.com/motion/',
    note: 'Animation primitives for page and micro-interactions.',
  },
  {
    title: 'Google Maps Platform / Places',
    url: 'https://developers.google.com/maps',
    note: 'Map display and place details where API keys are configured.',
  },
  {
    title: 'Google Translate Website Translator',
    url: 'https://translate.google.com/intl/en/about/website/',
    note: 'Optional page translation widget in the site header.',
  },
  {
    title: 'Lucide icons',
    url: 'https://lucide.dev/',
    note: 'Open-source icon set used in navigation and UI.',
  },
  {
    title: 'TSA Themes & Problems',
    url: 'https://tsaweb.org/',
    note: 'Official source for the annual high school design theme and problem statement.',
  },
];

export default function ReferencePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-16">
      <div className="flex items-start gap-4">
        <div className="h-14 w-1.5 rounded-full bg-gradient-to-b from-accent to-gold shrink-0 mt-1" />
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Reference Page</h1>
          <p className="text-foreground-secondary mt-3 text-sm leading-relaxed max-w-2xl">
            Charlotte Connect is a TSA Webmaster competition entry. This page lists information sources and required
            competition documents. The site is fully accessible without passwords or accounts, in line with national
            event regulations.
          </p>
        </div>
      </div>

      <section className="clt-glass rounded-3xl p-6 sm:p-8 border border-border-light space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-accent shrink-0" />
          Required forms (PDF)
        </h2>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          Per the TSA High School Competitive Events Guide, the reference page must link to a completed Student
          Copyright Checklist and Work Log in PDF format. Replace the placeholder files in{' '}
          <code className="text-xs bg-surface-muted px-1.5 py-0.5 rounded">public/documents/</code> with your
          chapter&apos;s signed PDFs before submission; the links below must download working PDFs for judges.
        </p>
        <ul className="space-y-3">
          <li>
            <a
              href="/documents/student-copyright-checklist.pdf"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              download
            >
              <FileText className="w-4 h-4 shrink-0" />
              Student Copyright Checklist (PDF)
            </a>
          </li>
          <li>
            <a
              href="/documents/work-log.pdf"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              download
            >
              <FileText className="w-4 h-4 shrink-0" />
              Work Log (PDF)
            </a>
          </li>
        </ul>
      </section>

      <section className="clt-glass rounded-3xl p-6 sm:p-8 border border-border-light space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">Framework & template disclosure</h2>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          This project uses{' '}
          <strong className="text-foreground">Next.js</strong>, <strong className="text-foreground">React</strong>,
          and <strong className="text-foreground">Tailwind CSS</strong> as frameworks. All page layouts, visual design,
          copy, and component structure were created and customized by the team for the annual theme — no pre-built
          commercial templates or themes were applied without team-authored customization.
        </p>
      </section>

      <section className="clt-glass rounded-3xl p-6 sm:p-8 border border-border-light space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">Sources of information</h2>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          The following sources informed public-sector context, technical implementation, or third-party services
          integrated into the solution. Content on resource detail pages is synthesized for educational purposes; verify
          hours and eligibility with each organization directly.
        </p>
        <ul className="space-y-4">
          {SOURCES.map((s) => (
            <li key={s.url} className="text-sm border-b border-border-light pb-4 last:border-0 last:pb-0">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent inline-flex items-center gap-1.5 hover:underline"
              >
                {s.title}
                <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden />
              </a>
              <p className="text-foreground-secondary mt-1 leading-relaxed">{s.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-gold/30 bg-gold/5 p-6 sm:p-8 space-y-3">
        <h2 className="font-display text-lg font-bold text-foreground">TSA compliance highlights</h2>
        <ul className="list-disc pl-5 text-sm text-foreground-secondary space-y-2 leading-relaxed">
          <li>No login, paywall, or credentials are required to view the main solution (meets Webmaster access rules).</li>
          <li>
            The resource hub includes live search, multi-filter controls (category, area, cost, format, audience), sort
            options (relevance, A–Z, distance with optional location), and shareable filtered URLs.
          </li>
          <li>Multiple linked sections: home, resource hub, detail pages, help flow, guides, and this reference page.</li>
          <li>Tested for current versions of Chrome, Firefox, and Edge; layout uses responsive breakpoints for phones.</li>
          <li>Multilingual access via header language selector (Google Translate website widget).</li>
        </ul>
      </section>

      <Link href="/home" className="text-sm font-semibold text-accent hover:underline inline-block">
        ← Back to home
      </Link>
    </div>
  );
}
