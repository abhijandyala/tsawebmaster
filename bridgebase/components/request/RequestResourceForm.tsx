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
      setMsg('Submissions aren’t available — this environment isn’t fully configured.');
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
      setMsg('Could not submit. Try again later or contact support if it keeps happening.');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="w-full max-w-lg mx-auto space-y-5 clt-glass rounded-3xl p-6 sm:p-8 border border-border-light text-left"
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
        placeholder="Resource or organization you need"
        value={resource}
        onChange={(e) => setResource(e.target.value)}
        required
      />
      <Textarea
        placeholder="Why it matters — helps us prioritize"
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        rows={5}
        required
      />
      {status !== 'idle' && (
        <p className={`text-sm font-medium ${status === 'ok' ? 'text-success' : 'text-error'}`}>{msg}</p>
      )}
      <Button type="submit" variant="primary" className="w-full">
        Submit request
      </Button>
    </motion.form>
  );
}
