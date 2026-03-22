'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Check, X, Clock, MapPin, Phone, Mail, Globe,
  Loader2, RefreshCw
} from 'lucide-react';
import { PublicChrome } from '@/components/layout';

interface Submission {
  id: string;
  organizationName: string;
  category: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  cost?: string;
  languages?: string[];
  walkIn?: boolean;
  hours?: string;
  reason: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/submit');
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    setUpdating(id);
    try {
      const response = await fetch('/api/submit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setSubmissions(prev => 
          prev.map(s => s.id === id ? { ...s, status } : s)
        );
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    filter === 'all' || s.status === filter
  );

  const counts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <PublicChrome>
      <div className="pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                Resource Submissions
              </h1>
              <p className="text-foreground-secondary">
                Review and moderate community resource submissions
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              disabled={isLoading}
              className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface border border-border"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm font-medium border transition-colors whitespace-nowrap ${
                  filter === status
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-foreground-secondary hover:border-primary/50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-surface rounded">
                  {counts[status]}
                </span>
              </button>
            ))}
          </div>

          {/* Submissions list */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
              <p className="text-foreground-secondary">No {filter} submissions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 bg-surface border border-border"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium ${
                          submission.status === 'pending' 
                            ? 'bg-warning-surface text-warning'
                            : submission.status === 'approved'
                            ? 'bg-success-surface text-success'
                            : 'bg-error-surface text-error'
                        }`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {submission.category}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {submission.organizationName}
                      </h3>
                    </div>
                    <span className="text-xs text-foreground-muted whitespace-nowrap">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-foreground-secondary mb-4">
                    {submission.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground-secondary mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-foreground-muted" />
                      {submission.address}
                    </div>
                    {submission.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-foreground-muted" />
                        {submission.phone}
                      </div>
                    )}
                    {submission.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-foreground-muted" />
                        {submission.email}
                      </div>
                    )}
                    {submission.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-foreground-muted" />
                        <a 
                          href={submission.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {submission.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {submission.reason && (
                    <p className="text-sm text-foreground-muted italic mb-4">
                      &ldquo;{submission.reason}&rdquo;
                    </p>
                  )}

                  {submission.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <button
                        onClick={() => handleStatusChange(submission.id, 'approved')}
                        disabled={updating === submission.id}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-success text-white hover:bg-success/90 transition-colors disabled:opacity-50"
                      >
                        {updating === submission.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(submission.id, 'rejected')}
                        disabled={updating === submission.id}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-error text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicChrome>
  );
}
