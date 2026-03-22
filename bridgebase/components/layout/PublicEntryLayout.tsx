'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const BG_DURATION = 0.62;

const pageVariants = {
  initial: (reduce: boolean) =>
    reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
  animate: (reduce: boolean) =>
    reduce
      ? { opacity: 1, transition: { duration: 0.2 } }
      : {
          opacity: 1,
          y: 0,
          transition: { duration: BG_DURATION, ease: EASE },
        },
  exit: (reduce: boolean) =>
    reduce
      ? { opacity: 0, transition: { duration: 0.12 } }
      : {
          opacity: 0,
          y: -14,
          transition: { duration: BG_DURATION * 0.92, ease: EASE },
        },
};

export function PublicEntryLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isAuth = pathname === '/auth';

  const bgTransition = reduceMotion
    ? { duration: 0.2 }
    : { duration: BG_DURATION, ease: EASE };

  return (
    <div className="relative min-h-[100dvh] bg-[#0d1210]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="clt-blob clt-blob-a -top-20 -left-16 opacity-50 dark:opacity-45" />
          <div className="clt-blob clt-blob-b top-1/3 -right-20 opacity-40 dark:opacity-35" />
          <div className="clt-blob clt-blob-c bottom-0 left-1/3 opacity-38 dark:opacity-32" />
        </div>

        <motion.div
          className="absolute inset-0 will-change-[filter,transform]"
          initial={false}
          animate={{
            filter: isAuth ? 'blur(10px)' : 'blur(0px)',
            scale: isAuth ? 1.045 : 1,
          }}
          transition={bgTransition}
        >
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isAuth ? 0.55 : 0.88 }}
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
        </motion.div>
      </div>

      <div className="relative z-10 grid min-h-[100dvh] grid-cols-1 grid-rows-[minmax(100dvh,auto)]">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={pathname}
            role="presentation"
            custom={!!reduceMotion}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="col-start-1 row-start-1 min-h-[100dvh] w-full self-start"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
