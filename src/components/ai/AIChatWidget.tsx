'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, ShieldCheck, ChevronRight, RefreshCw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Jambo! I am **A&E AI**, your digital real estate advisor for Kenya from **Ardhi and Estates**. Ask me about property prices, rental yields, due diligence checklists, or search verified listings across all 47 counties.'
    }
  ]);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    'Find a 2-bedroom in Nairobi under KSh 10M',
    'Calculate rental yield benchmarks',
    'What due diligence checks should I do?'
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
          content: 'Sorry, I encountered an issue connecting to the property intelligence service. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-white shadow-premium transition-all duration-300 hover:scale-105 hover:bg-emerald-800"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a3871]">
            <Bot className="h-4 w-4 text-[#c59228]" />
          </div>
          <span className="text-xs font-extrabold tracking-wide">Ask A&E AI</span>
          <span className="flex h-2 w-2 rounded-full bg-[#c59228] animate-ping" />
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="flex h-[520px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0a3871] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-[#c59228]">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-bold block">A&E AI Advisor</span>
                <span className="text-[10px] text-blue-200 block">Ardhi and Estates • Real Estate Intelligence</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-emerald-200 hover:bg-emerald-700 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex animate-fade-up ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap transition-all ${
                    m.role === 'user'
                      ? 'bg-emerald-700 text-white font-medium rounded-br-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50 shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-center gap-2.5 rounded-2xl bg-slate-100 px-4 py-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-emerald-500/20 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" />
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    Analysing your request across Kenya&apos;s verified database...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          {suggestedPrompts.length > 0 && !loading && (
            <div className="border-t border-slate-100 px-3 py-2 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap gap-1.5">
              {suggestedPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="border-t border-slate-200 p-3 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about properties, yields, or checks..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-emerald-700 p-2 text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}