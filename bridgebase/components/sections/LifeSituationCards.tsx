'use client';

import { motion } from 'framer-motion';
import { 
  Utensils, Home, Heart, Brain, Briefcase, AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface LifeSituationCardsProps {
  onSituationSelect: (query: string) => void;
}

const situations = [
  {
    id: 'food-today',
    title: "I need food today",
    description: "Emergency food banks and meal programs",
    icon: Utensils,
    query: "free food emergency food bank",
    color: 'accent',
    urgent: true,
  },
  {
    id: 'rent-help',
    title: "I'm behind on rent",
    description: "Rent assistance and housing support",
    icon: Home,
    query: "rent assistance housing help",
    color: 'primary',
    urgent: false,
  },
  {
    id: 'healthcare',
    title: "I need affordable care",
    description: "Free clinics and low-cost healthcare",
    icon: Heart,
    query: "free clinic healthcare no insurance",
    color: 'primary',
    urgent: false,
  },
  {
    id: 'mental-health',
    title: "I need mental health help",
    description: "Counseling and support services",
    icon: Brain,
    query: "mental health counseling therapy",
    color: 'primary',
    urgent: false,
  },
  {
    id: 'jobs',
    title: "I need a job",
    description: "Employment services and training",
    icon: Briefcase,
    query: "jobs employment career training",
    color: 'primary',
    urgent: false,
  },
  {
    id: 'crisis',
    title: "I'm in crisis",
    description: "Emergency help and crisis support",
    icon: AlertTriangle,
    query: "emergency crisis help",
    color: 'warning',
    urgent: true,
  },
];

export function LifeSituationCards({ onSituationSelect }: LifeSituationCardsProps) {
  return (
    <section className="section-padding bg-background-alt">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            What&apos;s going on?
          </h2>
          <p className="text-foreground-secondary max-w-xl mx-auto">
            Click your situation to find relevant resources immediately
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {situations.map((situation, index) => {
            const Icon = situation.icon;
            
            return (
              <motion.button
                key={situation.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => onSituationSelect(situation.query)}
                className={`group relative p-5 text-left border transition-all hover:shadow-lg ${
                  situation.urgent
                    ? 'border-warning/50 hover:border-warning bg-warning-surface/30'
                    : 'border-border hover:border-primary/50 bg-surface'
                }`}
              >
                {situation.urgent && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-warning rounded-full animate-pulse" />
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 ${
                    situation.urgent 
                      ? 'bg-warning/10 text-warning' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {situation.title}
                    </h3>
                    <p className="text-sm text-foreground-secondary mt-1">
                      {situation.description}
                    </p>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-foreground-muted">
            Need guided help?{' '}
            <a href="/help" className="text-primary font-medium hover:underline">
              Try our step-by-step assistant
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
