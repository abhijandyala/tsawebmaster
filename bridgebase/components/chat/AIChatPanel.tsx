'use client';

/**
 * Floating AI assistant (disabled in shell for now). Re-mount from AppShell when ready.
 */
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
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-gold to-[#a89d3a] text-[#23361D] shadow-lg flex items-center justify-center border-2 border-white/40"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-[60] w-[min(100vw-2rem,420px)] h-[min(70vh,520px)] clt-glass rounded-3xl border-2 border-accent/25 flex flex-col overflow-hidden shadow-[var(--shadow-lg)]"
          >
            <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-accent-soft/50 to-gold/10">
              <p className="font-display font-bold text-foreground">Resource assistant</p>
              <p className="text-xs text-foreground-muted">Matched against our hub catalog</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.length === 0 && (
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  Ask in plain language — we&apos;ll suggest resources or tell you if we need to add one.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-2xl px-4 py-3 max-w-[92%] whitespace-pre-wrap text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-accent text-white ml-auto shadow-sm'
                      : 'bg-surface-muted text-foreground mr-auto border border-border-light'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {loading && <p className="text-xs text-foreground-muted">Thinking…</p>}
            </div>
            <div className="p-3 border-t border-border flex gap-2 bg-surface-muted/40">
              <input
                className="flex-1 rounded-2xl border-2 border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                placeholder="What do you need?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <Button type="button" variant="accent" className="shrink-0 px-4" disabled={loading} onClick={send}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
