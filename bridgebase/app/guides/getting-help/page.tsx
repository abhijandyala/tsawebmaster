'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Phone, MapPin, FileText,
  Users, Heart, CheckCircle, ArrowRight
} from 'lucide-react';
import { PublicChrome } from '@/components/layout';

const steps = [
  {
    number: 1,
    title: 'Identify what you need',
    description: 'Start by thinking about the specific type of help you need. Common categories include food, housing, healthcare, jobs, and mental health support.',
    icon: Search,
  },
  {
    number: 2,
    title: 'Search or use personalized help',
    description: 'Use our search bar for specific queries, or use personalized help for a guided experience that matches you to the right resources.',
    icon: Heart,
  },
  {
    number: 3,
    title: 'Review your options',
    description: 'Look at the results carefully. Check eligibility requirements, hours, and what services each organization offers.',
    icon: FileText,
  },
  {
    number: 4,
    title: 'Call ahead',
    description: 'Before visiting, call to confirm hours, required documents, and whether they can help with your specific situation.',
    icon: Phone,
  },
  {
    number: 5,
    title: 'Prepare your documents',
    description: 'Gather any required documents like ID, proof of address, income verification, or other paperwork mentioned.',
    icon: Users,
  },
  {
    number: 6,
    title: 'Visit and get help',
    description: 'Go to the location during their hours. Be patient and honest about your needs—staff are there to help.',
    icon: MapPin,
  },
];

const quickResources = [
  { name: 'NC 211', phone: '211', description: 'Free 24/7 helpline for all community resources' },
  { name: '988 Crisis Line', phone: '988', description: 'Mental health crisis support' },
  { name: 'Emergency Services', phone: '911', description: 'Life-threatening emergencies' },
];

export default function GettingHelpPage() {
  return (
    <PublicChrome>
      <div className="pt-8 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
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
              How to Get Help in Charlotte
            </h1>
            <p className="text-lg text-foreground-secondary">
              A step-by-step guide to finding and accessing community resources in the Charlotte area.
            </p>
          </motion.div>

          {/* Quick Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 p-6 bg-primary/5 border border-primary/20"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Need help right now?
            </h2>
            <div className="space-y-3">
              {quickResources.map((resource) => (
                <div key={resource.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{resource.name}</p>
                    <p className="text-sm text-foreground-secondary">{resource.description}</p>
                  </div>
                  <a
                    href={`tel:${resource.phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {resource.phone}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Steps */}
          <div className="space-y-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {step.number}. {step.title}
                    </h3>
                    <p className="text-foreground-secondary">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-surface border border-border mb-12"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Tips for Success
            </h2>
            <ul className="space-y-3 text-foreground-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Be patient—some resources have waiting lists or limited availability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Ask about other services they offer—many organizations provide multiple types of help</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Bring a support person if you&apos;re comfortable—they can help you remember information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Don&apos;t give up if one resource can&apos;t help—there are many options available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Keep records of who you spoke with and what they said</span>
              </li>
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-foreground-secondary mb-4">
              Ready to find help?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/help"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                Start personalized help
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-primary/50 font-medium transition-colors"
              >
                Search Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicChrome>
  );
}
