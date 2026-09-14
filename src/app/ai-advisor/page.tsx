'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, Send, ShieldCheck, Database, RefreshCw, Layers, Scale, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Jambo! I am **A&E AI**, Kenya’s dedicated Real Estate Intelligence Assistant from **Ardhi and Estates**. I have live access to verified property passports, submarket median asking prices, developer progress audits, and due diligence benchmarks across all 47 counties.\n\nHow can I help you find, verify, or evaluate an investment today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    'Find me a 2-bedroom apartment in Nairobi under KSh 10 million with good rental yield',
    'Which areas around Nairobi have the highest rental yields in 2026?',
    'What statutory checks are required under the Sectional Properties Act 2020?',
    'What should I inspect before buying land in Ruiru or Kitengela?'
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, history: messages })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      if (data.suggestedPrompts && Array.isArray(data.suggestedPrompts)) {
        setSuggestedPrompts(data.suggestedPrompts);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue retrieving real-time property intelligence. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-forest-500/30 bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-800 dark:bg-forest-950/60 dark:text-forest-300 mb-3">
          <Bot className="w-4 h-4 text-forest-700 dark:text-forest-400" />
          <span>Autonomous Real Estate Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          A&E AI Real Estate Advisor
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Powered by verified Kenyan PropTech datasets, spatial indexes, and statutory title compliance frameworks by Ardhi and Estates.
        </p>
      </div>

      {/* Statutory Legal Disclaimer Banner */}
      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <span className="font-bold">Statutory Compliance Notice:</span> A&E AI provides market intelligence and structured data analysis only. In accordance with the Advocates Act and Land Registration Act (2012), it does NOT provide formal legal counsel or statutory title guarantees. For transactional conveyancing, always consult a licensed advocate.
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col h-[640px]">
        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-3xl p-5 leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-forest-900 text-white font-medium rounded-br-none'
                    : 'bg-slate-50 text-slate-800 dark:bg-slate-800/80 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
                }`}
              >
                {m.content}

                {/* Professional Advocate Referral Gate CTA */}
                {m.role === 'assistant' && (m.content.includes('Advocate') || m.content.includes('STATUTORY')) && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Need formal legal due diligence?
                    </span>
                    <Link
                      href="/professionals?service=CONVEYANCING"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-forest-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-forest-800 transition-colors shadow-xs"
                    >
                      <Scale className="w-3.5 h-3.5 text-ochre-400" />
                      <span>Consult Verified Advocate →</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <RefreshCw className="h-4 w-4 animate-spin text-[#c59228]" />
                <span>A&E AI is searching verified property records &amp; executing analytics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask anything about Kenyan properties, yields, budgets, or due diligence..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}