'use client';

import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
};

export function SignupRequiredModal({ isOpen, onClose, feature }: Props) {
  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a free account" size="sm">
      <div className="px-6 pb-6 pt-1">
        <p className="text-foreground-secondary text-sm mb-6 leading-relaxed">
          {feature
            ? `To ${feature}, sign in or create an account — it’s free.`
            : 'Sign in or create an account to use this feature.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="accent"
            className="flex-1"
            onClick={() => {
              onClose();
              router.push('/auth');
            }}
          >
            Get started
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Not now
          </Button>
        </div>
      </div>
    </Modal>
  );
}
