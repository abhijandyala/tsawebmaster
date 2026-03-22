'use client';

import Link from 'next/link';
import { scrollToSection } from '@/lib/utils';

const links = [
  { label: 'Resources', href: 'featured' },
  { label: 'About', href: 'about' },
  { label: 'Submit', href: 'submit' },
];

const guides = [
  { label: 'How to Get Help', href: '/guides/getting-help' },
  { label: 'Emergency Guide', href: '/guides/emergency' },
  { label: 'What to Bring', href: '/guides/what-to-bring' },
  { label: 'Get Help Now', href: '/help' },
];

const categories = [
  'Food Assistance',
  'Housing',
  'Healthcare',
  'Mental Health',
  'Education',
  'Jobs',
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-moss text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-white/20 flex items-center justify-center">
                  <span className="font-display text-xs font-bold">CC</span>
                </div>
                <span className="font-display text-base font-semibold">Charlotte Connect</span>
              </div>
              <p className="text-white/60 text-sm">
                Connecting the Charlotte area to trusted local resources.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                Navigate
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guides */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                Guides
              </h3>
              <ul className="space-y-2">
                {guides.map((guide) => (
                  <li key={guide.href}>
                    <Link
                      href={guide.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {guide.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                Contact
              </h3>
              <address className="not-italic text-sm text-white/70 space-y-2">
                <p>Charlotte, NC</p>
                <p>
                  <a href="mailto:info@charlotteconnect.org" className="hover:text-white transition-colors">
                    info@charlotteconnect.org
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>

        <div className="py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {currentYear} Charlotte Connect</p>
          <div className="flex items-center gap-4">
            <a href="tel:988" className="hover:text-white transition-colors">Crisis Line: 988</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
