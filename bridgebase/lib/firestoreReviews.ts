import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseDb } from '@/lib/firebase';

export type FirestoreReview = {
  id: string;
  resourceId: string;
  userId: string;
  rating: number;
  text: string;
  anonymous: boolean;
  authorLabel: string;
  createdAt?: { seconds: number };
  status: 'approved' | 'flagged' | 'removed';
};

const BAD_WORDS = ['spam', 'scam']; // minimal; extend or use API

export function subscribeResourceReviews(
  resourceId: string,
  onData: (reviews: FirestoreReview[], avg: number) => void
): Unsubscribe {
  const db = getFirebaseDb();
  if (!db) {
    onData([], 0);
    return () => {};
  }
  const q = query(collection(db, 'reviews'), where('resourceId', '==', resourceId));
  return onSnapshot(q, (snap) => {
    let list: FirestoreReview[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<FirestoreReview, 'id'>),
    }));
    list = list.filter((r) => r.status === 'approved');
    list.sort((a, b) => {
      const ta = a.createdAt?.seconds ?? 0;
      const tb = b.createdAt?.seconds ?? 0;
      return tb - ta;
    });
    const ratings = list.map((r) => r.rating).filter((n) => n > 0);
    const avg =
      ratings.length === 0 ? 0 : Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
    onData(list, avg);
  });
}

export async function submitReview(
  user: User,
  input: {
    resourceId: string;
    rating: number;
    text: string;
    anonymous: boolean;
  }
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore unavailable');
  const t = input.text.trim();
  if (t.length < 4 || t.length > 2000) throw new Error('Review length invalid');
  const lower = t.toLowerCase();
  if (BAD_WORDS.some((w) => lower.includes(w))) throw new Error('Review not allowed');

  const authorLabel = input.anonymous
    ? 'Anonymous'
    : user.displayName || user.email?.split('@')[0] || 'User';

  await addDoc(collection(db, 'reviews'), {
    resourceId: input.resourceId,
    userId: user.uid,
    rating: input.rating,
    text: t,
    anonymous: input.anonymous,
    authorLabel,
    status: 'approved',
    createdAt: serverTimestamp(),
  });
}
