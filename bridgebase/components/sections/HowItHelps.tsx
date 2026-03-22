'use client';

import { motion } from 'framer-motion';

const steps = [
  { number: '1', title: 'Search', description: 'Find resources by category or keyword' },
  { number: '2', title: 'Filter', description: 'Narrow down by location and cost' },
  { number: '3', title: 'Connect', description: 'Get contact info and reach out' },
];

export function HowItHelps() {
  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            How it works
          </h2>
          <p className="text-foreground-secondary">
            No sign-ups needed. Just search and connect.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <span className="font-display text-4xl font-bold text-primary/20">{step.number}</span>
              <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-foreground-secondary">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
