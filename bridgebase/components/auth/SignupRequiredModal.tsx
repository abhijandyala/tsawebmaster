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
    <Modal isOpen={isOpen} onClose={onClose} title="Create an account" size="sm">
      <div className="px-6 pb-6 pt-2">
        <p className="text-foreground-secondary text-sm mb-4">
          {feature
            ? `To ${feature}, please create a free account or sign in.`
            : 'Please create a free account or sign in to use this feature.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
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
