'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { TrustExplainerModal } from '@/components/trust/TrustExplainerModal';

interface TrustScoreProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  propertyTitle?: string;
}

export function TrustScore({ score, size = 'md', showDetails = false, propertyTitle }: TrustScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimatedScore(score);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1800;
          const start = performance.now();

          const animate = (time: number) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            // Quartic easing for slow, smart deceleration
            const ease = 1 - Math.pow(1 - progress, 4);
            setAnimatedScore(Math.round(ease * score));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setAnimatedScore(score);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [score, hasAnimated]);

  let label = 'EXCELLENT';
  let colorClass = 'text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
  let strokeColor = '#059669';

  if (score < 60) {
    label = 'CONCERN';
    colorClass = 'text-red-600 dark:text-red-400 border-red-500 bg-red-50 dark:bg-red-950/40';
    strokeColor = '#dc2626';
  } else if (score < 75) {
    label = 'FAIR';
    colorClass = 'text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/40';
    strokeColor = '#d97706';
  } else if (score < 88) {
    label = 'GOOD';
    colorClass = 'text-emerald-700 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30';
    strokeColor = '#047857';
  }

  if (size === 'sm') {
    return (
      <div
        ref={containerRef}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-300 ${colorClass}`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{animatedScore}/100</span>
      </div>
    );
  }

  const dimensions = size === 'lg' ? 'w-16 h-16 text-base' : 'w-13 h-13 text-sm';

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center gap-3 cursor-pointer group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
    >
      <div className={`relative flex items-center justify-center ${dimensions} transition-transform duration-300 group-hover:scale-105`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeDasharray={`${animatedScore}, 100`}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke={strokeColor}
            fill="none"
            className="transition-all duration-500 ease-out"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="font-black text-slate-900 dark:text-slate-100">{animatedScore}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Trust Score</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {animatedScore} / 100 — <span className="text-emerald-600 dark:text-emerald-400">{label}</span>
        </div>
      </div>

      {/* Interactive Tooltip Breakdown */}
      {showTooltip && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-slate-950 p-3.5 text-white shadow-2xl backdrop-blur-xl dark:border-slate-800 z-50 animate-scale-in">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
            <span>Verified Trust Factors</span>
            <span className="font-mono">{score}/100</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Title Deed Registry
              </span>
              <span className="font-mono text-emerald-400">25 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Cadastral GPS Survey
              </span>
              <span className="font-mono text-emerald-400">20 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Physical Inspection
              </span>
              <span className="font-mono text-emerald-400">20 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Owner Identity KYC
              </span>
              <span className="font-mono text-emerald-400">20 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Rates & Encumbrance
              </span>
              <span className="font-mono text-emerald-400">15 pts</span>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExplainer(true);
                  setShowTooltip(false);
                }}
                className="w-full text-center text-[10.5px] font-bold text-ochre-400 hover:text-ochre-300 underline py-0.5"
              >
                Verification Methodology &amp; Legal Disclaimers →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust & Legal Disclaimers Explainer Modal */}
      <TrustExplainerModal
        isOpen={showExplainer}
        onClose={() => setShowExplainer(false)}
        trustScore={score}
        propertyTitle={propertyTitle}
      />
    </div>
  );
}