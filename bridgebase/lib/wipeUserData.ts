import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseDb } from '@/lib/firebase';

export async function wipeUserFirestoreData(user: User): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const favSnap = await getDocs(collection(db, 'users', user.uid, 'favorites'));
  await Promise.all(favSnap.docs.map((d) => deleteDoc(d.ref)));

  const recentSnap = await getDocs(collection(db, 'users', user.uid, 'recentViews'));
  await Promise.all(recentSnap.docs.map((d) => deleteDoc(d.ref)));

  const reviewsQ = query(collection(db, 'reviews'), where('userId', '==', user.uid));
  const revSnap = await getDocs(reviewsQ);
  await Promise.all(revSnap.docs.map((d) => deleteDoc(d.ref)));

  await deleteDoc(doc(db, 'users', user.uid));
}
