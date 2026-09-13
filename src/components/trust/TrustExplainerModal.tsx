'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Scale, CheckCircle2, FileText, MapPin, X, ArrowRight, ExternalLink } from 'lucide-react';

interface TrustExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trustScore?: number;
  propertyTitle?: string;
}

export function TrustExplainerModal({
  isOpen,
  onClose,
  trustScore = 85,
  propertyTitle = 'Property'
}: TrustExplainerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 dark:bg-forest-900/40 text-forest-700 dark:text-forest-400 border border-forest-200 dark:border-forest-800">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                REKSA Trust &amp; Verification Framework
              </h2>
              <span className="rounded-full bg-ochre-100 dark:bg-ochre-900/50 px-2.5 py-0.5 text-xs font-bold text-ochre-700 dark:text-ochre-300">
                Score: {trustScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear disclosure on verification methodology &amp; statutory legal limitations
            </p>
          </div>
        </div>

        {/* What REKSA Checks vs What Is NOT Guaranteed */}
        <div className="space-y-5 my-6 text-xs sm:text-sm">
          {/* Section A: What We Verify */}
          <div className="rounded-2xl border border-forest-200/80 bg-forest-50/50 p-4 dark:border-forest-900/60 dark:bg-forest-950/30">
            <h3 className="font-bold text-forest-900 dark:text-forest-300 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-forest-600 dark:text-forest-400" />
              <span>What REKSA Verifies &amp; Audits:</span>
            </h3>
            <ul className="space-y-1.5 text-forest-800 dark:text-forest-200/90 text-xs pl-6 list-disc">
              <li><strong>Document Presence &amp; Completeness:</strong> Audit of Title Deed copy, Sectional Plan, Allotment Letter, and Land Rates receipts.</li>
              <li><strong>Visual Stamp &amp; Signature Consistency:</strong> AI and human review for alterations, inconsistent seal stamps, and historical transfer continuity.</li>
              <li><strong>Spatial Beacon Ground Verification:</strong> GPS boundary cross-referencing against official survey plan coordinates.</li>
              <li><strong>Lister &amp; Agency Credibility:</strong> Identification checks on property owners, estate agency licensing, and physical office verification.</li>
            </ul>
          </div>

          {/* Section B: Statutory Legal Guardrails & Disclaimers */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Statutory Legal Limitation &amp; Due Diligence Notice:</span>
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed mb-2">
              Under the <strong>Land Registration Act (2012)</strong> and the <strong>Sectional Properties Act (2020)</strong> of Kenya, REKSA operates as an independent market intelligence platform. <strong>REKSA is NOT a statutory land registry or title insurer.</strong>
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
              A high Trust Score verifies document consistency and physical inspection facts, but <em>does not guarantee statutory title validity</em> against undisclosed court disputes, caveats, or unregistered spousal consents. <strong>A formal official search at Ardhi House (Ministry of Lands) via a licensed advocate is mandatory before paying transaction deposits.</strong>
            </p>
          </div>
        </div>

        {/* Direct Action CTAs into Professional Marketplace */}
        <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            Recommended Next Step for Buyers &amp; Investors:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/professionals?service=CONVEYANCING"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:border-forest-600 dark:border-slate-700 dark:bg-slate-800 text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-forest-700 dark:text-forest-400" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Engage Conveyancing Advocate</span>
                  <span className="text-[10.5px] text-slate-500">Official title search &amp; sales agreement</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-forest-600 transition-colors" />
            </Link>

            <Link
              href="/professionals?service=VALUATION"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:border-forest-600 dark:border-slate-700 dark:bg-slate-800 text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-ochre-600 dark:text-ochre-400" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Book Certified Land Valuer</span>
                  <span className="text-[10.5px] text-slate-500">Bank-approved valuation &amp; survey report</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-forest-600 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-forest-900 px-5 py-2 text-xs font-bold text-white hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
