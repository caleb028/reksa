'use client';

import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Download } from 'lucide-react';

export interface ReceiptData {
  receiptNumber: string;
  publicReference?: string;
  productSummary: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  mpesaReceipt?: string;
  customerPhone?: string;
  customerName?: string;
  organizationName?: string;
  issuedAt: string | Date;
}

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export function PaymentReceiptModal({ isOpen, onClose, receipt }: PaymentReceiptModalProps) {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(receipt.issuedAt).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white">
      <div
        className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 print:border-none print:shadow-none print:max-w-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions header (hidden on print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official Payment Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Receipt Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img src="/images/reksa-cube.png" alt="REKSA" className="h-8 w-auto object-contain" />
                <span className="text-xl font-black tracking-tight text-[#0a3871] dark:text-white">
                  REKSA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Kenya&apos;s Intelligent Real Estate Platform
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Delta Corner Tower, Westlands, Nairobi • billing@reksa.co.ke
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                PAID &amp; VERIFIED
              </span>
              <div className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                {receipt.receiptNumber}
              </div>
              <div className="text-[10px] text-slate-400">{formattedDate}</div>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850/60 text-xs space-y-2.5">
            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500">Billed Entity:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {receipt.organizationName || receipt.customerName || 'Verified REKSA User'}
              </span>
            </div>

            {receipt.customerPhone && (
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Customer Phone:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{receipt.customerPhone}</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {receipt.paymentMethod || 'M-Pesa (Safaricom Daraja)'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500">M-Pesa Trans. ID:</span>
              <span className="font-mono font-black text-slate-900 dark:text-white">
                {receipt.mpesaReceipt || 'CONFIRMED'}
              </span>
            </div>

            {receipt.publicReference && (
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{receipt.publicReference}</span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Description:</span>
              <span className="font-semibold text-slate-900 dark:text-white max-w-[240px] text-right truncate">
                {receipt.productSummary}
              </span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-5 py-4 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                Total Paid (Tax Inclusive)
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Zero transaction charge applied</span>
            </div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
              KES {receipt.amount.toLocaleString()}
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
            This electronic receipt was generated automatically by the REKSA platform upon trusted confirmation from Safaricom Daraja. It serves as official proof of payment for real-estate listing, advertising, or operating SaaS subscription services under Kenyan Tax Law.
          </div>
        </div>
      </div>
    </div>
  );
}
