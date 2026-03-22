'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, FileText, CreditCard, Home, Briefcase, Heart,
  Users, CheckSquare, AlertCircle, Utensils
} from 'lucide-react';
import { PublicChrome } from '@/components/layout';

const generalDocuments = [
  { name: 'Government-issued ID', description: 'Driver\'s license, state ID, or passport', required: true },
  { name: 'Proof of address', description: 'Utility bill, lease, or mail with your address', required: true },
  { name: 'Social Security card', description: 'Original or copy', required: false },
  { name: 'Birth certificates', description: 'For yourself and any children', required: false },
];

const categories = [
  {
    name: 'Food Assistance',
    icon: Utensils,
    documents: [
      'Photo ID',
      'Proof of address in service area',
      'Proof of income (if required)',
      'Number of household members',
    ],
    tips: [
      'Many food banks don\'t require documentation',
      'Call ahead to ask about requirements',
      'Bring bags or boxes to carry food',
    ],
  },
  {
    name: 'Housing & Rent Help',
    icon: Home,
    documents: [
      'Photo ID for all adults',
      'Lease agreement or eviction notice',
      'Proof of income (pay stubs, benefits letter)',
      'Landlord contact information',
      'Past due bills or utility shutoff notices',
    ],
    tips: [
      'Bring original documents when possible',
      'Get a letter from your landlord if possible',
      'Apply before you miss payments if you can',
    ],
  },
  {
    name: 'Healthcare',
    icon: Heart,
    documents: [
      'Photo ID',
      'Insurance card (if you have one)',
      'Proof of income',
      'Proof of residency',
      'List of current medications',
    ],
    tips: [
      'Many free clinics accept patients without insurance',
      'Bring a list of any allergies',
      'Know your medical history or bring records',
    ],
  },
  {
    name: 'Jobs & Employment',
    icon: Briefcase,
    documents: [
      'Resume (bring copies)',
      'Photo ID',
      'Social Security card',
      'Work authorization documents (if applicable)',
      'References list',
    ],
    tips: [
      'Dress professionally',
      'Bring a pen and notepad',
      'Know your work history and dates',
    ],
  },
  {
    name: 'Benefits & Financial Aid',
    icon: CreditCard,
    documents: [
      'Photo ID for all adults',
      'Social Security cards for everyone',
      'Proof of income for last 30 days',
      'Bank statements',
      'Rent/mortgage payment info',
      'Utility bills',
    ],
    tips: [
      'Apply online first if possible',
      'Keep copies of everything you submit',
      'Ask about expedited benefits if urgent',
    ],
  },
  {
    name: 'Family & Youth Services',
    icon: Users,
    documents: [
      'Birth certificates for children',
      'Custody documents (if applicable)',
      'School enrollment papers',
      'Immunization records',
      'Proof of income',
    ],
    tips: [
      'Both parents may need to provide ID',
      'Bring any court orders or custody agreements',
      'Ask about additional services for families',
    ],
  },
];

export default function WhatToBringPage() {
  return (
    <PublicChrome>
      <div className="pt-8 pb-16">
        <div className="max-w-3xl mx-auto w-full">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              What to Bring to Your Appointment
            </h1>
            <p className="text-lg text-foreground-secondary">
              Be prepared with the right documents to get help faster.
            </p>
          </motion.div>

          {/* General Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 p-6 bg-primary/5 border border-primary/20"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Documents Most Places Need
            </h2>
            <div className="space-y-3">
              {generalDocuments.map((doc) => (
                <div key={doc.name} className="flex items-start gap-3">
                  <CheckSquare className={`w-5 h-5 flex-shrink-0 ${doc.required ? 'text-primary' : 'text-foreground-muted'}`} />
                  <div>
                    <p className="font-medium text-foreground">
                      {doc.name}
                      {doc.required && <span className="text-error ml-1">*</span>}
                    </p>
                    <p className="text-sm text-foreground-secondary">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground-muted mt-4">
              * Required at most organizations
            </p>
          </motion.div>

          {/* By Category */}
          <div className="space-y-8 mb-12">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="p-6 bg-surface border border-border"
                >
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-accent" />
                    {category.name}
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-foreground-muted mb-3">Documents to bring:</p>
                      <ul className="space-y-2">
                        {category.documents.map((doc, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                            <CheckSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-foreground-muted mb-3">Tips:</p>
                      <ul className="space-y-2">
                        {category.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                            <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* General Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-warning-surface border border-warning/30 mb-12"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Don&apos;t have all the documents?
            </h2>
            <ul className="space-y-3 text-foreground-secondary">
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span><strong>Go anyway.</strong> Many organizations can help even without perfect documentation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span><strong>Call ahead.</strong> Ask what&apos;s absolutely required vs. what&apos;s helpful.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span><strong>Ask for help getting documents.</strong> Many places can help you obtain ID or other papers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span><strong>Bring what you have.</strong> Even expired documents or unofficial copies can sometimes help.</span>
              </li>
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Find resources that match your needs
            </Link>
          </motion.div>
        </div>
      </div>
    </PublicChrome>
  );
}
