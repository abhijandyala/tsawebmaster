'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Trash2, Phone, MapPin, Globe, Printer, Share2,
  FileText, Plus, CheckCircle, Edit3, Save, X
} from 'lucide-react';
import { PublicChrome } from '@/components/layout';
import { 
  SavedResource, 
  getSavedResources, 
  removeResource, 
  updateNotes, 
  clearPlan 
} from '@/lib/helpPlan';

export default function MyPlanPage() {
  const [resources, setResources] = useState<SavedResource[]>([]);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    setResources(getSavedResources());
    
    const handleUpdate = () => setResources(getSavedResources());
    window.addEventListener('help-plan-updated', handleUpdate);
    return () => window.removeEventListener('help-plan-updated', handleUpdate);
  }, []);

  const handleRemove = (id: string) => {
    removeResource(id);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire plan?')) {
      clearPlan();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = resources.map(r => 
      `${r.name}\n${r.address}\n${r.phone || 'No phone'}\n`
    ).join('\n---\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Help Plan - Charlotte Connect',
          text: text,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Plan copied to clipboard!');
    }
  };

  const startEditNotes = (id: string, currentNotes?: string) => {
    setEditingNotes(id);
    setNotesText(currentNotes || '');
  };

  const saveNotes = (id: string) => {
    updateNotes(id, notesText);
    setResources(getSavedResources());
    setEditingNotes(null);
  };

  return (
    <PublicChrome>
      <div className="pt-8 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link 
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-accent mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Link>

          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                My Help Plan
              </h1>
              <p className="text-foreground-secondary">
                {resources.length === 0 
                  ? 'Save resources to build your personalized help plan'
                  : `${resources.length} resource${resources.length === 1 ? '' : 's'} saved`
                }
              </p>
            </div>

            {resources.length > 0 && (
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface border border-border"
                  title="Print plan"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface border border-border"
                  title="Share plan"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {resources.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <FileText className="w-16 h-16 text-foreground-muted mx-auto mb-6" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                No resources saved yet
              </h2>
              <p className="text-foreground-secondary mb-6 max-w-md mx-auto">
                Search for resources and click the save button to add them to your plan.
                Your plan is stored locally on your device.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                >
                  Search Resources
                </Link>
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-primary/50 font-medium transition-colors"
                >
                  Get personalized help
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Print header - only visible when printing */}
              <div className="hidden print:block mb-8 pb-4 border-b border-border">
                <h1 className="text-2xl font-bold">My Help Plan - Charlotte Connect</h1>
                <p className="text-sm text-foreground-muted">Generated on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-4 mb-8">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 bg-surface border border-border print:border-black print:shadow-none"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-xs text-accent font-medium">{resource.category}</span>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {resource.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleRemove(resource.id)}
                        className="p-2 text-foreground-muted hover:text-error transition-colors print:hidden"
                        title="Remove from plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="flex items-start gap-2 text-foreground-secondary">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {resource.address}
                      </p>
                      {resource.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-foreground-muted" />
                          <a href={`tel:${resource.phone}`} className="text-primary hover:underline">
                            {resource.phone}
                          </a>
                        </p>
                      )}
                      {resource.website && (
                        <p className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-foreground-muted" />
                          <a 
                            href={resource.website} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {resource.website}
                          </a>
                        </p>
                      )}
                      {resource.cost && (
                        <p className="text-success font-medium">{resource.cost}</p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="mt-4 pt-4 border-t border-border print:hidden">
                      {editingNotes === resource.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            placeholder="Add personal notes (e.g., what to bring, contact person)..."
                            className="w-full p-3 text-sm bg-background border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveNotes(resource.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-primary text-white hover:bg-primary/90"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNotes(null)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground-secondary hover:text-foreground"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {resource.notes ? (
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-foreground-secondary italic">
                                &ldquo;{resource.notes}&rdquo;
                              </p>
                              <button
                                onClick={() => startEditNotes(resource.id, resource.notes)}
                                className="text-foreground-muted hover:text-foreground"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditNotes(resource.id)}
                              className="flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground"
                            >
                              <Plus className="w-4 h-4" />
                              Add notes
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Print notes */}
                    {resource.notes && (
                      <div className="hidden print:block mt-4 pt-4 border-t border-border">
                        <p className="text-sm"><strong>Notes:</strong> {resource.notes}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 print:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/20 hover:bg-primary/5"
                >
                  <Plus className="w-4 h-4" />
                  Add more resources
                </Link>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-foreground-muted hover:text-error"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              </div>

              {/* Tips */}
              <div className="mt-12 p-6 bg-surface border border-border print:hidden">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Next Steps
                </h3>
                <ul className="space-y-2 text-sm text-foreground-secondary">
                  <li>1. Call each resource to confirm hours and requirements</li>
                  <li>2. Gather any documents they need (ID, proof of address, etc.)</li>
                  <li>3. Print this page or save it on your phone</li>
                  <li>4. Ask about other services they offer when you visit</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          body { background: white; }
          header, footer { display: none !important; }
        }
      `}</style>
    </PublicChrome>
  );
}
