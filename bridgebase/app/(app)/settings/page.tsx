'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from '@/contexts/auth-context';
import { getFirebaseAuth } from '@/lib/firebase';
import { wipeUserFirestoreData } from '@/lib/wipeUserData';
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
    if (!user || !confirm('Delete all your favorites, history, and reviews from our database?')) return;
    setBusy(true);
    try {
      await wipeUserFirestoreData(user);
      localStorage.removeItem('charlotte-connect-help-plan');
      localStorage.removeItem('clt-recent-resources');
      setMsg('Your app data was wiped.');
    } catch {
      setMsg('Could not wipe data (check Firestore rules).');
    } finally {
      setBusy(false);
    }
  };

  const deleteAccount = async () => {
    if (!user || !confirm('Permanently delete your account? This cannot be undone.')) return;
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return;
    setBusy(true);
    setMsg('');
    try {
      if (user.email && pwd) {
        const cred = EmailAuthProvider.credential(user.email, pwd);
        await reauthenticateWithCredential(auth.currentUser, cred);
      }
      await wipeUserFirestoreData(user);
      await deleteUser(auth.currentUser);
      await logout();
      router.push('/');
    } catch {
      setMsg(
        'Could not delete account. If you use email login, enter your password below and try again. You may need to re-sign in.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-lg space-y-4">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-foreground-secondary">
          Sign in to manage your profile. In demo mode, settings are not available.
        </p>
        <Button variant="primary" type="button" onClick={() => router.push('/auth')}>
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <section className="space-y-3 bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-semibold">Display name</h2>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" />
        <Button variant="primary" type="button" disabled={busy} onClick={saveName}>
          Save
        </Button>
      </section>

      <section className="space-y-3 bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-semibold">Wipe my data</h2>
        <p className="text-sm text-foreground-secondary">
          Removes favorites, recent views, and your reviews from Firestore. Does not delete your login.
        </p>
        <Button variant="outline" type="button" disabled={busy} onClick={wipe}>
          Wipe data
        </Button>
      </section>

      <section className="space-y-3 bg-surface border border-border rounded-2xl p-6 border-error/40">
        <h2 className="font-semibold text-error">Delete account</h2>
        <p className="text-sm text-foreground-secondary">
          For email/password accounts, enter your password to confirm. Google users: use the Google account settings
          to revoke access, or contact support.
        </p>
        <Input
          type="password"
          placeholder="Current password (email users)"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <Button variant="primary" type="button" disabled={busy} className="bg-error hover:bg-error/90" onClick={deleteAccount}>
          Delete account
        </Button>
      </section>

      {msg && <p className="text-sm text-foreground-secondary">{msg}</p>}
    </div>
  );
}
