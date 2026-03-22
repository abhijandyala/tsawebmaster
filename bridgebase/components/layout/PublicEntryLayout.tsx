'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
/** Background crossfade — keep short; blur/scale on full viewport is expensive and reads choppy. */
const BG_DURATION = 0.42;
/** Page swap: `wait` avoids landing + auth animating at once (layout thrash). */
const PAGE_ENTER = 0.38;
const PAGE_EXIT = 0.28;

const pageVariants = {
  initial: (reduce: boolean) => (reduce ? { opacity: 0 } : { opacity: 0, y: 10 }),
  animate: (reduce: boolean) =>
    reduce
      ? { opacity: 1, transition: { duration: 0.2 } }
      : {
          opacity: 1,
          y: 0,
          transition: { duration: PAGE_ENTER, ease: EASE },
        },
  exit: (reduce: boolean) =>
    reduce
      ? { opacity: 0, transition: { duration: 0.12 } }
      : {
          opacity: 0,
          y: -8,
          transition: { duration: PAGE_EXIT, ease: EASE },
        },
};

export function PublicEntryLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isAuth = pathname === '/auth';

  const bgTransition = reduceMotion ? { duration: 0.2 } : { duration: BG_DURATION, ease: EASE };

  return (
    <div className="relative min-h-[100dvh] bg-[#0d1210]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="clt-blob clt-blob-a -top-20 -left-16 opacity-50 dark:opacity-45" />
          <div className="clt-blob clt-blob-b top-1/3 -right-20 opacity-40 dark:opacity-35" />
          <div className="clt-blob clt-blob-c bottom-0 left-1/3 opacity-38 dark:opacity-32" />
        </div>

        {/* Opacity-only: avoid filter blur + scale on full-bleed layers (main cause of choppy route transitions). */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isAuth ? 0.5 : 0.88 }}
            transition={bgTransition}
          >
            <Image
              src="/charlotte_nc.png"
              alt=""
              fill
              priority
              className="object-cover dark:opacity-90"
              sizes="100vw"
            />
          </motion.div>

          <motion.div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-[#23361D]/88 via-[#447CB3]/42 to-[#23361D]/75"
            initial={false}
            animate={{ opacity: isAuth ? 0 : 1 }}
            transition={bgTransition}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#0d1210]/90 via-transparent to-[#447CB3]/15"
            initial={false}
            animate={{ opacity: isAuth ? 0 : 1 }}
            transition={bgTransition}
          />

          <motion.div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-[#D4D8EC]/80 via-[#447CB3]/25 to-[#23361D]/50 dark:from-[#0f1419]/92 dark:via-[#1a2430]/88 dark:to-[#23361D]/45"
            initial={false}
            animate={{ opacity: isAuth ? 1 : 0 }}
            transition={bgTransition}
          />
        </div>
      </div>

      <div className="relative z-10 grid min-h-[100dvh] grid-cols-1 grid-rows-[minmax(100dvh,auto)] overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            role="presentation"
            custom={!!reduceMotion}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="col-start-1 row-start-1 min-h-[100dvh] w-full max-w-full self-start"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
