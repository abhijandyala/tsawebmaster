'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { SubmissionFormData, Category } from '@/lib/types';
import { validateEmail, validatePhone } from '@/lib/utils';

const categoryOptions: { value: Category | ''; label: string }[] = [
  { value: '', label: 'Select category' },
  { value: 'Food Assistance', label: 'Food Assistance' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Mental Health', label: 'Mental Health' },
  { value: 'Education', label: 'Education' },
  { value: 'Jobs', label: 'Jobs' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Youth Programs', label: 'Youth Programs' },
  { value: 'Emergency Help', label: 'Emergency Help' },
];

const initialFormData: SubmissionFormData = {
  organizationName: '',
  category: '',
  description: '',
  address: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  audience: '',
  reason: '',
};

export function SubmitResourceForm() {
  const [formData, setFormData] = useState<SubmissionFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.organizationName.trim()) newErrors.organizationName = 'Required';
    if (!formData.category) newErrors.category = 'Required';
    if (!formData.description.trim() || formData.description.length < 50) 
      newErrors.description = 'Min 50 characters';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.email.trim() || !validateEmail(formData.email)) 
      newErrors.email = 'Valid email required';
    if (!formData.phone.trim() || !validatePhone(formData.phone)) 
      newErrors.phone = 'Valid phone required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: formData.organizationName,
          category: formData.category,
          description: formData.description,
          address: formData.address,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          reason: formData.reason,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  return (
    <section id="submit" className="section-padding border-t border-border">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            Submit a Resource
          </h2>
          <p className="text-foreground-secondary">
            Know a helpful organization? Share it with the community.
          </p>
        </motion.div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Thank you!
            </h3>
            <p className="text-foreground-secondary mb-6">
              Your submission has been received.
            </p>
            <button
              onClick={() => { setIsSuccess(false); setFormData(initialFormData); }}
              className="text-primary hover:underline"
            >
              Submit another
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Organization"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                error={errors.organizationName}
              />
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
                error={errors.category}
              />
            </div>

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What does this resource offer? (min 50 characters)"
              error={errors.description}
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>

            <Input
              label="Website (optional)"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full gap-2"
            >
              <Send className="w-4 h-4" />
              Submit
            </Button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
