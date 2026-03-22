'use client';

import { motion } from 'framer-motion';
import { Category } from '@/lib/types';
import { scrollToSection } from '@/lib/utils';
import { cn } from '@/lib/utils';

const categories: Category[] = [
  'Food Assistance',
  'Housing',
  'Healthcare',
  'Mental Health',
  'Education',
  'Jobs',
  'Transportation',
  'Youth Programs',
  'Emergency Help',
];

interface CategoryStripProps {
  onCategorySelect: (category: Category) => void;
  selectedCategory?: Category;
}

export function CategoryStrip({ onCategorySelect, selectedCategory }: CategoryStripProps) {
  const handleClick = (category: Category) => {
    onCategorySelect(category);
    scrollToSection('search-results');
  };

  return (
    <section id="categories" className="py-6 border-y border-border bg-background-alt/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleClick(category)}
              className={cn(
                'px-3 py-1.5 text-sm transition-colors',
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'text-foreground-secondary hover:text-foreground'
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
