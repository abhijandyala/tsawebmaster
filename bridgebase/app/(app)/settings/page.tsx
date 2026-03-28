'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from '@/contexts/auth-context';
import { getFirebaseAuth } from '@/lib/firebase';
import { wipeUserFirestoreData } from '@/lib/wipeUserData';
import { getLocalFavoriteIds, setLocalFavoriteIds } from '@/lib/localFavorites';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { user, updateDisplayName, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.displayName || '');
  const [busy, setBusy] = useState(false);
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState('');

  const saveName = async () => {
    setBusy(true);
    setMsg('');
    try {
      await updateDisplayName(name);
      setMsg('Display name updated.');
    } catch {
      setMsg('Could not update name.');
    } finally {
      setBusy(false);
    }
  };

  const wipe = async () => {
    if (!user || !confirm('Remove synced favorites, recent views, and reviews? You’ll stay signed in.')) return;
    setBusy(true);
    try {
      await wipeUserFirestoreData(user);
      localStorage.removeItem('charlotte-connect-help-plan');
      localStorage.removeItem('clt-recent-resources');
      setMsg('Your app data was wiped.');
    } catch {
      setMsg('Could not wipe data.');
    } finally {
      setBusy(false);
    }
  };

  const clearLocalOnly = () => {
    if (!confirm('Clear favorites and recent resources stored in this browser?')) return;
    setLocalFavoriteIds([]);
    localStorage.removeItem('clt-recent-resources');
    localStorage.removeItem('charlotte-connect-help-plan');
    setMsg('Local favorites and recent list cleared.');
  };

  const deleteAccount = async () => {
    if (!user || !confirm('Permanently delete your account?')) return;
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return;
    setBusy(true);
    setMsg('');
    try {
      if (user.email && pwd) {
        const cred = EmailAuthProvider.credential(user.email, pwd);
        await reauthenticateWithCredential(auth.currentUser, cred);
      }
      await wipeUserFirestoreData(user, { keepProfile: false });
      await deleteUser(auth.currentUser);
      await logout();
      router.push('/');
    } catch {
      setMsg('Could not delete account. For email login, enter password below and try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-8">
        <div className="h-10 w-1.5 rounded-full bg-accent mb-4" />
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          Charlotte Connect is open without sign-in for the TSA Webmaster competition. Use the options below to manage
          data stored in this browser.
        </p>
        <section className="clt-glass rounded-3xl p-6 space-y-4 border border-border-light">
          <h2 className="font-semibold text-foreground">Local data</h2>
          <p className="text-sm text-foreground-secondary">
            Favorites: <strong className="text-foreground">{getLocalFavoriteIds().length}</strong> saved on this device.
          </p>
          <Button variant="outline" type="button" onClick={clearLocalOnly}>
            Clear local favorites & recent
          </Button>
        </section>
        <p className="text-sm">
          <Link href="/reference" className="font-semibold text-accent hover:underline">
            Reference page →
          </Link>{' '}
          (sources, copyright checklist, work log)
        </p>
        {msg && <p className="text-sm text-foreground-muted">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-accent to-primary shrink-0" />
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-foreground-secondary mt-2">Profile and data controls</p>
        </div>
      </div>

      <section className="clt-glass rounded-3xl p-6 space-y-4 border border-border-light">
        <h2 className="font-semibold text-foreground">Display name</h2>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="How we greet you" />
        <Button variant="secondary" type="button" disabled={busy} onClick={saveName}>
          Save
        </Button>
      </section>

      <section className="clt-glass rounded-3xl p-6 space-y-4 border border-border-light">
        <h2 className="font-semibold text-foreground">Wipe my data</h2>
        <p className="text-sm text-foreground-secondary">
          Removes favorites, recent views, and your reviews. Keeps your login.
        </p>
        <Button variant="outline" type="button" disabled={busy} onClick={wipe}>
          Wipe data
        </Button>
      </section>

      <section className="clt-glass rounded-3xl p-6 space-y-4 border border-gold/30 bg-gold/5">
        <h2 className="font-semibold text-error">Delete account</h2>
        <p className="text-sm text-foreground-secondary">
          Email users: enter your password to confirm. With Google sign-in, you may be asked to sign in again to
          confirm.
        </p>
        <Input
          type="password"
          placeholder="Password (email accounts)"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <Button variant="danger" type="button" disabled={busy} onClick={deleteAccount}>
          Delete account
        </Button>
      </section>

      {msg && <p className="text-sm text-foreground-muted">{msg}</p>}
    </div>
  );
}
