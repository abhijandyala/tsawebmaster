import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseDb } from '@/lib/firebase';

export type WipeUserDataOptions = {
  /** When false (account deletion), remove the profile document too. Default true for “wipe my data”. */
  keepProfile?: boolean;
};

export async function wipeUserFirestoreData(
  user: User,
  options: WipeUserDataOptions = {}
): Promise<void> {
  const { keepProfile = true } = options;
  const db = getFirebaseDb();
  if (!db) return;

  const favSnap = await getDocs(collection(db, 'users', user.uid, 'favorites'));
  await Promise.all(favSnap.docs.map((d) => deleteDoc(d.ref)));

  const recentSnap = await getDocs(collection(db, 'users', user.uid, 'recentViews'));
  await Promise.all(recentSnap.docs.map((d) => deleteDoc(d.ref)));

  const reviewsQ = query(collection(db, 'reviews'), where('userId', '==', user.uid));
  const revSnap = await getDocs(reviewsQ);
  await Promise.all(revSnap.docs.map((d) => deleteDoc(d.ref)));

  if (keepProfile) {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        displayName: user.displayName || '',
        email: user.email || '',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } else {
    await deleteDoc(doc(db, 'users', user.uid));
  }
}
