import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseDb } from '@/lib/firebase';

export async function addFavorite(user: User, resourceId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore unavailable');
  await setDoc(
    doc(db, 'users', user.uid, 'favorites', resourceId),
    { resourceId, savedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function removeFavorite(user: User, resourceId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore unavailable');
  await deleteDoc(doc(db, 'users', user.uid, 'favorites', resourceId));
}

export async function listFavoriteIds(user: User): Promise<string[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const snap = await getDocs(collection(db, 'users', user.uid, 'favorites'));
  return snap.docs.map((d) => d.id);
}

export async function touchRecentView(user: User, resourceId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore unavailable');
  await setDoc(
    doc(db, 'users', user.uid, 'recentViews', resourceId),
    { resourceId, viewedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function listRecentIds(user: User, max = 12): Promise<string[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const snap = await getDocs(collection(db, 'users', user.uid, 'recentViews'));
  const rows = snap.docs.map((d) => ({
    id: d.id,
    t: (d.data().viewedAt as { seconds?: number } | undefined)?.seconds ?? 0,
  }));
  rows.sort((a, b) => b.t - a.t);
  return rows.slice(0, max).map((r) => r.id);
}
