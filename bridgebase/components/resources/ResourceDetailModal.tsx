'use client';

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  DollarSign,
  Building2,
  Languages,
  CheckCircle2,
  Accessibility,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Resource } from '@/lib/types';

interface ResourceDetailModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResourceDetailModal({
  resource,
  isOpen,
  onClose,
}: ResourceDetailModalProps) {
  if (!resource) return null;

  const getCostVariant = (cost: string) => {
    switch (cost) {
      case 'Free':
        return 'success';
      case 'Low-cost':
        return 'accent';
      default:
        return 'default';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="accent" size="md">
            {resource.category}
          </Badge>
          <Badge variant={getCostVariant(resource.cost)} size="md">
            {resource.cost}
          </Badge>
          <Badge variant="outline" size="md">
            {resource.format}
          </Badge>
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
          {resource.name}
        </h2>

        <p className="text-foreground-secondary text-lg mb-6 leading-relaxed">
          {resource.description}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
              Contact Information
            </h3>
            
            <div className="space-y-3">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(resource.address + ', ' + resource.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {resource.address}
                  </p>
                  <p className="text-sm text-foreground-secondary">
                    {resource.city}
                    {resource.neighborhood && ` • ${resource.neighborhood}`}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${resource.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {resource.phone}
                </p>
              </a>

              <a
                href={`mailto:${resource.email}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {resource.email}
                </p>
              </a>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-foreground">{resource.hours}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
              Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Audience</p>
                  <p className="text-sm font-medium text-foreground">
                    {resource.audience.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Languages className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Languages</p>
                  <p className="text-sm font-medium text-foreground">
                    {resource.languages.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Format</p>
                  <p className="text-sm font-medium text-foreground">
                    {resource.format}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Cost</p>
                  <p className="text-sm font-medium text-foreground">
                    {resource.cost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {resource.eligibility && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3">
              Eligibility
            </h3>
            <p className="text-foreground bg-background-alt rounded-lg p-4">
              {resource.eligibility}
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3">
            Services Offered
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {resource.services.map((service) => (
              <div key={service} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-foreground">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {resource.accessibilityNotes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3">
              Accessibility
            </h3>
            <div className="flex items-start gap-3 bg-background-alt rounded-lg p-4">
              <Accessibility className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground">{resource.accessibilityNotes}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="success" size="md">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          {resource.website && (
            <Button
              variant="primary"
              size="lg"
              className="flex-1 gap-2"
              onClick={() => window.open(resource.website, '_blank')}
            >
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2"
            onClick={() => window.open(`tel:${resource.phone.replace(/\D/g, '')}`)}
          >
            <Phone className="w-4 h-4" />
            Call Now
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 gap-2"
            onClick={() =>
              window.open(
                `https://maps.google.com/?q=${encodeURIComponent(
                  resource.address + ', ' + resource.city
                )}`,
                '_blank'
              )
            }
          >
            <MapPin className="w-4 h-4" />
            Get Directions
          </Button>
        </div>
      </div>
    </Modal>
  );
}
