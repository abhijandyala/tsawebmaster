'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (typeof window !== 'undefined') sessionStorage.removeItem('clt_demo');
      router.replace('/home');
    }
  }, [user, loading, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);
    if (mode === 'signup' && password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }
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

  const passwordToggle = (visible: boolean, onToggle: () => void, label: string) => (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg p-1.5 text-foreground-muted transition-colors hover:bg-accent-soft/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={label}
    >
      {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
    </button>
  );

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <header className="relative z-20 flex justify-between items-center py-4 sm:py-5 clt-page-x">
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

      <div className="relative z-20 flex-1 flex items-center justify-center clt-page-x py-6 -mt-8 sm:-mt-10">
        <div className="w-full max-w-md clt-glass rounded-3xl p-6 sm:p-8 text-foreground">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">Welcome</h1>
          <p className="text-sm text-foreground-secondary mb-8">
            Sign in with Google or email to sync favorites and reviews.
          </p>

          {!firebaseReady && (
            <p className="text-sm text-error mb-4 p-4 rounded-xl bg-error-light border border-error/20">
              Sign-in isn&apos;t configured on this deployment. Copy variables from <code className="text-xs">.env.example</code>{' '}
              into <code className="text-xs">.env.local</code> for local development.
            </p>
          )}

          <AnimatePresence mode="wait">
            {(error || validationError) && (
              <motion.p
                key={error || validationError || 'err'}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-error mb-4"
              >
                {validationError || error}
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
              onClick={() => {
                setMode('signin');
                setConfirmPassword('');
                setValidationError(null);
                clearError();
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                mode === 'signup' ? 'bg-accent text-white shadow-sm' : 'text-foreground-secondary hover:text-foreground'
              }`}
              onClick={() => {
                setMode('signup');
                setValidationError(null);
                clearError();
              }}
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
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationError(null);
              }}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              suffix={passwordToggle(showPassword, () => setShowPassword((v) => !v), showPassword ? 'Hide password' : 'Show password')}
            />
            {mode === 'signup' && (
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationError(null);
                }}
                autoComplete="new-password"
                suffix={passwordToggle(
                  showConfirmPassword,
                  () => setShowConfirmPassword((v) => !v),
                  showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                )}
              />
            )}
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
