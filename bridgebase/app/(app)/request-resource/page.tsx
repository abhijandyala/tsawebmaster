import Link from 'next/link';
import { RequestResourceForm } from '@/components/request/RequestResourceForm';

export default function RequestResourcePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/resources" className="text-sm font-semibold text-accent hover:underline inline-block">
        ← Resource hub
      </Link>
      <div className="flex items-start gap-4">
        <div className="h-14 w-1.5 rounded-full bg-gradient-to-b from-accent to-gold shrink-0" />
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Request a resource</h1>
          <p className="text-foreground-secondary mt-3 text-sm leading-relaxed max-w-xl">
            Tell our team what&apos;s missing. Submissions are stored in Firestore for review.
          </p>
        </div>
      </div>
      <RequestResourceForm />
    </div>
  );
}
