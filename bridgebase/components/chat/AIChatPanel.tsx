'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AIChatPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: t }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', text: data.reply || 'Something went wrong.' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open assistant"
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-[60] w-[min(100vw-3rem,420px)] h-[min(70vh,520px)] bg-surface border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border font-semibold text-foreground">Resource assistant</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.length === 0 && (
                <p className="text-foreground-secondary">
                  Describe what you need — we&apos;ll match against resources in the hub.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-3 py-2 max-w-[95%] whitespace-pre-wrap ${
                    m.role === 'user' ? 'bg-accent/15 text-foreground ml-6' : 'bg-background-alt text-foreground mr-6'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {loading && <p className="text-foreground-muted text-xs">Thinking…</p>}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
                placeholder="What are you looking for?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <Button type="button" variant="primary" className="shrink-0" disabled={loading} onClick={send}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
