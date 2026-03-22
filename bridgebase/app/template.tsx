'use client';

import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Public entry uses its own synced blur/fade; avoid double motion here. */
const SKIP_TEMPLATE = new Set(['/', '/auth']);

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion || SKIP_TEMPLATE.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: easeOut }}
      className="min-h-0 min-w-0"
    >
      {children}
    </motion.div>
  );
}
