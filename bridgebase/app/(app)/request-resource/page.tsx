import Link from 'next/link';
import { RequestResourceForm } from '@/components/request/RequestResourceForm';

export default function RequestResourcePage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
      <Link href="/resources" className="text-sm font-semibold text-accent hover:underline">
        ← Resource hub
      </Link>
      <div className="flex flex-col items-center gap-4">
        <div className="h-1.5 w-14 rounded-full bg-gradient-to-r from-accent to-gold shrink-0" aria-hidden />
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Request a resource</h1>
          <p className="text-foreground-secondary mt-3 text-sm leading-relaxed max-w-xl mx-auto">
            Tell our team what&apos;s missing. We keep submissions for our team to review.
          </p>
        </div>
      </div>
      <RequestResourceForm />
    </div>
  );
}
