'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AuthPage() {
  const { user, loading, firebaseReady, signInWithGoogle, signInWithEmail, signUpWithEmail, error, clearError } =
    useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (typeof window !== 'undefined') sessionStorage.removeItem('clt_demo');
      router.replace('/home');
    }
  }, [user, loading, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setBusy(true);
    try {
      if (mode === 'signup') await signUpWithEmail(email, password, name);
      else await signInWithEmail(email, password);
    } catch {
      /* context sets error */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <header className="relative z-20 flex justify-between items-center p-4 sm:p-5">
        <Link
          href="/"
          className="text-sm font-medium text-foreground-secondary hover:text-accent px-3 py-2 rounded-xl hover:bg-accent-soft/30 transition-colors"
        >
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-20 flex-1 flex items-center justify-center p-6 -mt-8 sm:-mt-10">
        <div className="w-full max-w-md clt-glass rounded-3xl p-8 sm:p-10 text-foreground">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">Welcome</h1>
          <p className="text-sm text-foreground-secondary mb-8">
            Sign in with Google or email to sync favorites and reviews.
          </p>

          {!firebaseReady && (
            <p className="text-sm text-error mb-4 p-4 rounded-xl bg-error-light border border-error/20">
              Add Firebase keys from <code className="text-xs">.env.example</code> to{' '}
              <code className="text-xs">.env.local</code>.
            </p>
          )}

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-error mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 border-accent/40 hover:bg-accent-soft/40"
            disabled={!firebaseReady || busy}
            onClick={async () => {
              setBusy(true);
              clearError();
              try {
                await signInWithGoogle();
              } finally {
                setBusy(false);
              }
            }}
          >
            Continue with Google
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-3 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
                Or email
              </span>
            </div>
          </div>

          <div className="flex gap-2 p-1 mb-6 rounded-2xl bg-surface-muted border border-border">
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                mode === 'signin' ? 'bg-accent text-white shadow-sm' : 'text-foreground-secondary hover:text-foreground'
              }`}
              onClick={() => setMode('signin')}
            >
              Log in
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                mode === 'signup' ? 'bg-accent text-white shadow-sm' : 'text-foreground-secondary hover:text-foreground'
              }`}
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <Input placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full" disabled={!firebaseReady || busy}>
              {mode === 'signup' ? 'Create account' : 'Log in'}
            </Button>
          </form>

          {mode === 'signup' && (
            <p className="text-xs text-foreground-muted mt-4">We&apos;ll email you a verification link.</p>
          )}
        </div>
      </div>
    </div>
  );
}
