import Link from 'next/link';
import { RequestResourceForm } from '@/components/request/RequestResourceForm';

export default function RequestResourcePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/resources" className="text-sm text-accent hover:underline">
        ← Back to resource hub
      </Link>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Request a resource</h1>
        <p className="text-foreground-secondary mt-2 text-sm">
          Tell us what you need. Submissions are stored for our team (Firestore). Configure email delivery later with
          Resend if you want inbox notifications.
        </p>
      </div>
      <RequestResourceForm />
    </div>
  );
}
