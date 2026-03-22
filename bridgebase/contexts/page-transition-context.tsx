'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';

/**
 * Inspired by [Haptimize](https://github.com/Rockypocky77/Haptimize) TransitionContext:
 * full-viewport overlay fade → navigate → fade out on route settle.
 */
type PageTransitionContextValue = {
  isTransitioning: boolean;
  startTransition: (path: string) => void;
  endTransition: () => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

const FADE_IN_MS = 480;
const STAY_MS = 100;
const FADE_OUT_MS = 420;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<'idle' | 'fading-in' | 'white' | 'fading-out'>('idle');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const subscribersRef = useRef(new Set<() => void>());
  const subscribe = useCallback((cb: () => void) => {
    subscribersRef.current.add(cb);
    return () => {
      subscribersRef.current.delete(cb);
    };
  }, []);
  const getSnapshot = useCallback(() => phaseRef.current !== 'idle', []);

  const isTransitioning = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const notify = useCallback(() => {
    subscribersRef.current.forEach((cb) => cb());
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const setOverlay = useCallback((opacity: number, durationMs: number) => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = `opacity ${durationMs}ms ${EASING}`;
    el.style.opacity = String(opacity);
    el.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
  }, []);

  const startTransition = useCallback(
    (path: string) => {
      if (reduceMotion) {
        router.push(path);
        return;
      }
      if (phaseRef.current !== 'idle') return;
      phaseRef.current = 'fading-in';
      notify();
      clearTimers();

      const el = overlayRef.current;
      if (el) {
        el.style.transition = `opacity ${FADE_IN_MS}ms ${EASING}`;
        el.style.opacity = '0';
        el.style.pointerEvents = 'auto';
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (overlayRef.current) {
            overlayRef.current.style.opacity = '1';
          }
        });
      });

      const t = setTimeout(() => {
        phaseRef.current = 'white';
        router.push(path);
      }, FADE_IN_MS);
      timersRef.current.push(t);
    },
    [router, notify, clearTimers, reduceMotion]
  );

  const endTransition = useCallback(() => {
    if (reduceMotion) return;
    if (phaseRef.current === 'idle') return;

    clearTimers();
    phaseRef.current = 'fading-out';

    const t1 = setTimeout(() => {
      setOverlay(0, FADE_OUT_MS);
      const t2 = setTimeout(() => {
        phaseRef.current = 'idle';
        notify();
      }, FADE_OUT_MS);
      timersRef.current.push(t2);
    }, STAY_MS);
    timersRef.current.push(t1);
  }, [notify, clearTimers, setOverlay, reduceMotion]);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[200] bg-background opacity-0"
        style={{ willChange: 'opacity' }}
        aria-hidden
      />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    return {
      isTransitioning: false,
      startTransition: (path: string) => {
        void path;
      },
      endTransition: () => {},
    };
  }
  return ctx;
}

export const PAGE_TRANSITION_FADE_IN_MS = FADE_IN_MS;
