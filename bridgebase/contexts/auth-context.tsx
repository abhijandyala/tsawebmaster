'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  firebaseReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function ensureUserDoc(user: User) {
  const db = getFirebaseDb();
  if (!db) return;
  const ref = doc(db, 'users', user.uid);
  await setDoc(
    ref,
    {
      displayName: user.displayName || '',
      email: user.email || '',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await ensureUserDoc(u);
        } catch {
          /* non-fatal */
        }
      }
      setLoading(false);
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Sign-in isn’t configured. The app is missing its public environment keys.');
      return;
    }
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Google sign-in failed';
      setError(msg);
      throw e;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Sign-in isn’t configured on this deployment.');
      return;
    }
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign in failed';
      setError(msg);
      throw e;
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      const auth = getFirebaseAuth();
      if (!auth) {
        setError('Sign-in isn’t configured on this deployment.');
        return;
      }
      setError(null);
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName.trim()) {
          await updateProfile(cred.user, { displayName: displayName.trim() });
        }
        await sendEmailVerification(cred.user);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Sign up failed';
        setError(msg);
        throw e;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  }, []);

  const updateDisplayName = useCallback(async (name: string) => {
    const auth = getFirebaseAuth();
    if (!auth || !auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name.trim() });
    await ensureUserDoc(auth.currentUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      firebaseReady: isFirebaseConfigured(),
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      updateDisplayName,
      error,
      clearError,
    }),
    [
      user,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      updateDisplayName,
      error,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
