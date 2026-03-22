'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, AlertTriangle, Phone, Heart, Home, Utensils,
  Shield, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { PublicChrome } from '@/components/layout';

const emergencyResources = [
  {
    name: 'Police, Fire, Medical Emergency',
    number: '911',
    when: 'Life-threatening situations, crimes in progress, fires, serious injuries',
    color: 'error',
  },
  {
    name: '988 Suicide & Crisis Lifeline',
    number: '988',
    when: 'Suicidal thoughts, mental health crisis, emotional distress',
    color: 'warning',
  },
  {
    name: 'Domestic Violence Hotline',
    number: '1-800-799-7233',
    when: 'Domestic violence, abuse, safety planning',
    color: 'warning',
  },
  {
    name: 'NC 211',
    number: '211',
    when: 'Any non-emergency community resource need, available 24/7',
    color: 'primary',
  },
];

const isEmergency = [
  'You or someone is in immediate physical danger',
  'There is a fire or active crime',
  'Someone is having a heart attack, stroke, or severe injury',
  'Someone is threatening to hurt themselves or others right now',
  'A child is in immediate danger',
];

const isNotEmergency = [
  'You need food, but not starving right now',
  'You need help paying rent this month',
  'You need a doctor appointment but it\'s not urgent',
  'You\'re looking for a job or job training',
  'You need mental health support but aren\'t in crisis',
  'You need help finding childcare',
];

const urgentResources = [
  {
    category: 'Food',
    icon: Utensils,
    resources: [
      { name: 'Loaves & Fishes', description: 'Same-day emergency food' },
      { name: 'Second Harvest Food Bank', description: 'Mobile food pantries' },
    ],
  },
  {
    category: 'Housing',
    icon: Home,
    resources: [
      { name: 'Salvation Army', description: 'Emergency shelter' },
      { name: 'Crisis Assistance Ministry', description: 'Rent/utility assistance' },
    ],
  },
  {
    category: 'Healthcare',
    icon: Heart,
    resources: [
      { name: 'Care Ring', description: 'Free clinic, walk-ins available' },
      { name: 'Charlotte Community Health Clinic', description: 'Low-cost care' },
    ],
  },
];

export default function EmergencyGuidePage() {
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
              Emergency vs Non-Emergency
            </h1>
            <p className="text-lg text-foreground-secondary">
              Know when to call 911 and when to use other resources.
            </p>
          </motion.div>

          {/* Emergency Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Emergency & Crisis Lines
            </h2>
            <div className="space-y-3">
              {emergencyResources.map((resource) => (
                <div 
                  key={resource.name}
                  className={`p-4 border-l-4 ${
                    resource.color === 'error' 
                      ? 'border-error bg-error-surface' 
                      : resource.color === 'warning'
                      ? 'border-warning bg-warning-surface'
                      : 'border-primary bg-primary/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{resource.name}</h3>
                    <a
                      href={`tel:${resource.number.replace(/-/g, '')}`}
                      className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {resource.number}
                    </a>
                  </div>
                  <p className="text-sm text-foreground-secondary">{resource.when}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-error-surface border border-error/30"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-error" />
                Call 911 if...
              </h2>
              <ul className="space-y-3">
                {isEmergency.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                    <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-6 bg-success-surface border border-success/30"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Use other resources if...
              </h2>
              <ul className="space-y-3">
                {isNotEmergency.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                    <Shield className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Urgent but not 911 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Urgent Needs (Not 911)
            </h2>
            <p className="text-foreground-secondary mb-6">
              These organizations can help with urgent needs that aren&apos;t life-threatening emergencies.
            </p>
            <div className="space-y-6">
              {urgentResources.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.category}>
                    <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      {category.category}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {category.resources.map((resource) => (
                        <div key={resource.name} className="p-3 bg-surface border border-border">
                          <p className="font-medium text-foreground">{resource.name}</p>
                          <p className="text-sm text-foreground-secondary">{resource.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center p-6 bg-surface border border-border"
          >
            <p className="text-foreground-secondary mb-4">
              Not sure what you need? Call <a href="tel:211" className="text-primary font-medium">211</a> for free guidance 24/7.
            </p>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Or try personalized help
            </Link>
          </motion.div>
        </div>
      </div>
    </PublicChrome>
  );
}
