'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { scrollToSection } from '@/lib/utils';

const navLinks = [
  { label: 'Resources', href: 'featured', type: 'scroll' },
  { label: 'About', href: 'about', type: 'scroll' },
  { label: 'Submit', href: 'submit', type: 'scroll' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-surface/80 backdrop-blur-xl shadow-sm border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="font-display text-xs font-bold text-white">CC</span>
              </div>
              <span className="font-display text-lg font-semibold text-foreground">
                Charlotte Connect
              </span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/my-plan"
                className="px-4 py-2 text-sm text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                My Plan
              </Link>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <ThemeToggle />
              <button
                onClick={() => handleNavClick('featured')}
                className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Find Help
              </button>
            </div>

            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground-secondary hover:text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-surface border-b border-border shadow-md"
          >
            <nav className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full px-3 py-2.5 text-left text-foreground-secondary hover:text-foreground hover:bg-background-alt transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <Link
                  href="/my-plan"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full px-3 py-2.5 text-left text-foreground-secondary hover:text-foreground hover:bg-background-alt transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  My Plan
                </Link>
                <div className="pt-3 mt-2 border-t border-border">
                  <button
                    onClick={() => handleNavClick('featured')}
                    className="w-full py-2.5 text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Find Help
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
