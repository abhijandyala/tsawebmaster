'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch {
      /* context sets error */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ filter: 'blur(0px)', scale: 1 }}
        animate={{ filter: 'blur(6px)', scale: 1.04 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <Image src="/charlotte_nc.png" alt="" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-[#23361D]/50" />
      </motion.div>

      <header className="relative z-10 flex justify-between items-center p-4">
        <Link href="/" className="text-sm text-white/90 hover:text-white font-medium">
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <div className="[&_button]:border-white/40 [&_button]:text-white [&_span]:text-white">
            <LanguageSelector />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.1 }}
          className="w-full max-w-md rounded-3xl bg-[#D4D8EC]/95 backdrop-blur-md border border-white/40 shadow-xl p-8 text-[#23361D]"
        >
          <h1 className="font-display text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-sm text-[#50692B] mb-6">Use Google or email to access Charlotte Connect.</p>

          {!firebaseReady && (
            <p className="text-sm text-error mb-4 p-3 rounded-lg bg-error-light">
              Firebase is not configured. Add the variables from <code className="text-xs">.env.example</code> to{' '}
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
            className="w-full mb-4 border-[#23361D]/30 bg-white/80"
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#23361D]/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-[#D4D8EC] px-2 text-[#50692B]">Or email</span>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${
                mode === 'signin' ? 'bg-[#23361D] text-white' : 'bg-white/60 text-[#50692B]'
              }`}
              onClick={() => setMode('signin')}
            >
              Log in
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${
                mode === 'signup' ? 'bg-[#23361D] text-white' : 'bg-white/60 text-[#50692B]'
              }`}
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'signup' && (
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/90 border-[#23361D]/20"
              />
            )}
            <Input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/90 border-[#23361D]/20"
            />
            <Input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/90 border-[#23361D]/20"
            />
            <Button type="submit" variant="primary" className="w-full" disabled={!firebaseReady || busy}>
              {mode === 'signup' ? 'Create account' : 'Log in'}
            </Button>
          </form>

          {mode === 'signup' && (
            <p className="text-xs text-[#50692B] mt-3">
              We&apos;ll send a verification email. You can still explore after signing up.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
