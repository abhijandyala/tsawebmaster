'use client';

import { motion } from 'framer-motion';

export function AboutSection() {
  return (
    <section id="about" className="section-padding border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-6">
            About BridgeBase
          </h2>
          
          <p className="text-foreground-secondary leading-relaxed mb-6">
            BridgeBase brings together essential community resources in one searchable platform. 
            We believe everyone deserves easy access to support—food assistance, housing, healthcare, 
            job training, and more.
          </p>
          
          <p className="text-foreground-secondary leading-relaxed mb-8">
            Every resource is verified and regularly updated by community volunteers.
          </p>

          <blockquote className="border-l-2 border-primary pl-6 text-left">
            <p className="font-display text-lg text-foreground italic">
              "To help every community member discover the support they need."
            </p>
            <cite className="text-sm text-primary font-medium not-italic mt-2 block">
              — Our Mission
            </cite>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
