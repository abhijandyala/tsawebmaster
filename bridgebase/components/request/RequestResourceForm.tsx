'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { getFirebaseDb } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export function RequestResourceForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resource, setResource] = useState('');
  const [why, setWhy] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp) return;
    const db = getFirebaseDb();
    if (!db) {
      setStatus('err');
      setMsg('Firestore is not configured. Add Firebase keys to save requests.');
      return;
    }
    const message = `Resource requested: ${resource}\n\nWhy needed:\n${why}`;
    try {
      await addDoc(collection(db, 'resourceRequests'), {
        name: name.trim(),
        email: email.trim(),
        message,
        hp: '',
        createdAt: serverTimestamp(),
      });
      setStatus('ok');
      setMsg('Thanks — your request was submitted.');
      setName('');
      setEmail('');
      setResource('');
      setWhy('');
    } catch {
      setStatus('err');
      setMsg('Could not submit. Check Firestore rules and try again.');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="max-w-lg space-y-4 bg-surface border border-border rounded-2xl p-6"
    >
      <input
        type="text"
        name="website"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        type="email"
        placeholder="Contact email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        placeholder="Resource or organization you’re looking for"
        value={resource}
        onChange={(e) => setResource(e.target.value)}
        required
      />
      <Textarea
        placeholder="Why you need it (helps us prioritize)"
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        rows={5}
        required
      />
      {status !== 'idle' && (
        <p className={`text-sm ${status === 'ok' ? 'text-success' : 'text-error'}`}>{msg}</p>
      )}
      <Button type="submit" variant="primary">
        Submit request
      </Button>
    </motion.form>
  );
}
