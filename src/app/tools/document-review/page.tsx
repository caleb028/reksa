'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Upload, CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert, Bot, ArrowRight, RefreshCw } from 'lucide-react';
import { DocumentAnalysisOutput } from '@/ai/types';

export default function DocumentReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DocumentAnalysisOutput | null>(null);

  const handleSimulateSample = async (sampleType: string) => {
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/document-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: sampleType === 'sectional' ? 'Sectional_Property_Survey_Plan_U14.pdf' : (sampleType === 'allotment' ? 'Letter_Of_Allotment_Nairobi.pdf' : 'Certificate_Of_Title_LR209.pdf'),
          textContent: sampleType
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-3">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Automated Statutory Cross-Audit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          AI Property Document &amp; Deed Analyzer
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Upload title deeds, sectional plans, or allotment letters to audit structural completeness, missing signatures, and registered encumbrances.
        </p>
      </div>

      {/* Upload Box */}
      <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900 shadow-card mb-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-4">
          <Upload className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Upload Property Document (PDF, JPG, PNG)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Supported: Certificate of Title, Sectional Property Survey Plan, Mutation Forms, Letter of Allotment, Land Rates Clearance.
        </p>

        {/* Quick Sample Selector for Instant Review */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Or try verified sample deed:</span>
          <button
            onClick={() => handleSimulateSample('sectional')}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            Sample Sectional Plan (SPA 2020)
          </button>
          <button
            onClick={() => handleSimulateSample('allotment')}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            Sample Allotment Letter
          </button>
          <button
            onClick={() => handleSimulateSample('title')}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            Sample Freehold Title Deed
          </button>
        </div>
      </div>

      {analyzing && (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 shadow-card mb-8">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Analyzing Document Typography &amp; Seals...</h4>
          <p className="text-xs text-slate-500 mt-1">Cross-referencing registered entities and Director of Surveys boundary references.</p>
        </div>
      )}

      {/* Analysis Result Card */}
      {result && !analyzing && (
        <div className="rounded-3xl border border-emerald-500/30 bg-white p-6 sm:p-8 dark:border-emerald-500/20 dark:bg-slate-900 shadow-card space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Document Type Detected</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{result.documentType}</h3>
              {result.parcelNumber && (
                <span className="font-mono text-xs text-emerald-600 font-bold block mt-0.5">
                  Parcel / Ref: {result.parcelNumber}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Completeness</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {result.completenessScore}%
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <span className="text-slate-400 font-bold block text-[10px]">Identified Entities</span>
              <span className="font-semibold text-slate-900 dark:text-white">{result.detectedEntities.length} Recorded</span>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/40">
              <span className="text-amber-700 dark:text-amber-400 font-bold block text-[10px]">Potential Issues</span>
              <span className="font-semibold text-amber-800 dark:text-amber-300">{result.potentialIssues.length} Detected</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 font-bold block text-[10px]">Items Requiring Review</span>
              <span className="font-semibold text-slate-900 dark:text-white">{result.itemsRequiringReview.length} Items</span>
            </div>
          </div>

          {/* Detailed Lists */}
          <div className="space-y-4 text-xs">
            {result.itemsRequiringReview.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Items Requiring Professional Review:</h4>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  {result.itemsRequiringReview.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.potentialIssues.length > 0 && (
              <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-200 dark:border-amber-800 dark:bg-amber-950/30">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Potential Red Flags / Omissions:</span>
                </h4>
                <ul className="space-y-1 text-amber-900 dark:text-amber-200">
                  {result.potentialIssues.map((issue, idx) => (
                    <li key={idx}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* STATUTORY MANDATORY DISCLAIMER */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[11px] leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>Statutory Due Diligence Notice</span>
            </div>
            {result.legalValidityDisclaimer}
          </div>

          {/* Request Professional Review Action Button */}
          <div className="pt-2">
            <Link
              href="/professionals"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Request Professional Review with Certified Advocate or ISK Valuer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}