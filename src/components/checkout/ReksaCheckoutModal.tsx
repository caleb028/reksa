'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Phone,
  Building2,
  Sparkles,
  Receipt,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useApp } from '@/components/layout/AppProviders';

export interface CheckoutItem {
  productType: 'LISTING' | 'LISTING_RENEWAL' | 'FEATURED_LISTING' | 'SEARCH_BOOST' | 'HOMEPAGE_SPOTLIGHT' | 'SUBSCRIPTION';
  propertyId?: string;
  propertyTitle?: string;
  propertyType?: string;
  listingIntent?: string;
  countyName?: string;
  organizationId?: string;
  planCode?: string;
  planName?: string;
  promotionCodes?: string[];
  durationDays?: number;
}

interface ReksaCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckoutItem | null;
  onSuccess?: (paymentIntentId: string, receiptNumber?: string) => void;
  onPaymentSuccess?: (receipt: any) => void;
}

type CheckoutStep = 'REVIEW' | 'PHONE' | 'AWAITING_STK';
type StkState = 'WAITING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'UNKNOWN';

export function ReksaCheckoutModal({
  isOpen,
  onClose,
  item,
  onSuccess,
  onPaymentSuccess
}: ReksaCheckoutModalProps) {
  const { serverUser, notify } = useApp();
  const [step, setStep] = useState<CheckoutStep>('REVIEW');
  const [phoneNumber, setPhoneNumber] = useState(serverUser?.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Intent states
  const [intentId, setIntentId] = useState<string | null>(null);
  const [publicReference, setPublicReference] = useState<string>('');
  const [amountKes, setAmountKes] = useState<number>(0);
  const [lineItems, setLineItems] = useState<{ name: string; description: string; amountKes: number }[]>([]);
  const [volumeDiscountPercent, setVolumeDiscountPercent] = useState<number>(0);

  // STK Verification & Polling states
  const [stkState, setStkState] = useState<StkState>('WAITING');
  const [maskedPhone, setMaskedPhone] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);
  const [mpesaReceipt, setMpesaReceipt] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string>('');

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or fetch pricing intent when opened
  useEffect(() => {
    if (isOpen && item) {
      setStep('REVIEW');
      setStkState('WAITING');
      setErrorMsg('');
      setIntentId(null);
      setReceiptNumber(null);
      setMpesaReceipt(null);
      fetchPaymentIntent();
    } else {
      clearPolling();
    }
  }, [isOpen, item]);

  // Clean up polling timer
  useEffect(() => {
    return () => clearPolling();
  }, []);

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const fetchPaymentIntent = async () => {
    if (!item) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const idempotencyKey = `AE-${item.productType}-${item.propertyId || item.planCode || 'INTENT'}-${Date.now()}`;

      const res = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: item.productType,
          propertyId: item.propertyId,
          organizationId: item.organizationId,
          propertyType: item.propertyType || item.planCode,
          listingIntent: item.listingIntent,
          countyName: item.countyName,
          durationDays: item.durationDays || 30,
          promotionCodes: item.promotionCodes,
          phoneNumber: phoneNumber || undefined,
          idempotencyKey
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment calculation');
      }

      setIntentId(data.intentId);
      setPublicReference(data.publicReference);
      setAmountKes(data.amount);
      setLineItems(data.lineItems || []);
      setVolumeDiscountPercent(data.volumeDiscountPercent || 0);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error preparing checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatchStk = async () => {
    if (!intentId || !phoneNumber.trim()) {
      setErrorMsg('Please enter a valid Kenyan phone number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/payments/mpesa/stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentId,
          phoneNumber: phoneNumber.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'MPESA_CREDENTIALS_REQUIRED') {
          // Expose clearly to the user that credentials must be configured
          setErrorMsg(data.details || data.error);
          setIsLoading(false);
          return;
        }
        throw new Error(data.error || 'Failed to dispatch M-Pesa prompt.');
      }

      setMaskedPhone(data.maskedPhone || phoneNumber);
      setStep('AWAITING_STK');
      setStkState('WAITING');
      setCountdown(60);

      // Start real-time server polling
      startPolling(intentId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not connect to Safaricom Daraja.');
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = (targetIntentId: string) => {
    clearPolling();
    let secondsLeft = 60;

    pollingIntervalRef.current = setInterval(async () => {
      secondsLeft -= 2;
      setCountdown(Math.max(secondsLeft, 0));

      try {
        const res = await fetch(`/api/payments/intent/${targetIntentId}`);
        const data = await res.json();

        if (data.isCompleted) {
          clearPolling();
          setStkState('SUCCESS');
          setMpesaReceipt(data.mpesaReceipt || 'CONFIRMED');
          setReceiptNumber(data.receiptNumber || 'AE-REC-CONFIRMED');
          notify('Payment Confirmed', 'Your transaction was verified by Safaricom Daraja.', 'success');
          if (onSuccess) onSuccess(targetIntentId, data.receiptNumber);
          if (onPaymentSuccess) onPaymentSuccess(data.receipt || { receiptNumber: data.receiptNumber || 'AE-REC-CONFIRMED', intentId: targetIntentId });
          return;
        }

        if (data.isFailed) {
          clearPolling();
          setStkState('FAILED');
          setFailureReason(data.failureReason || 'Transaction was declined or cancelled on the phone.');
          return;
        }

        if (secondsLeft <= 0) {
          clearPolling();
          // After 60 seconds of pending, mark timeout or unknown
          if (data.isPending) {
            setStkState('UNKNOWN');
          } else {
            setStkState('TIMEOUT');
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-2 mb-4">
          <img src="/images/reksa-cube.png" alt="A&E" className="h-7 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#0a3871] dark:text-white leading-none">
              A&amp;E PAY
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              Ardhi &amp; Estates
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 ml-auto">
            Safaricom M-Pesa
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-2xl bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: REVIEW ORDER */}
        {step === 'REVIEW' && (
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Order Summary &amp; Entitlement Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review line items and commercial fee calculation for this property service.
            </p>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent mb-2" />
                <span className="text-xs text-slate-500 font-semibold">Calculating official fee...</span>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {/* Line Items Box */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                  <div className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs">
                    {lineItems.map((li, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-start gap-2">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{li.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{li.description}</div>
                        </div>
                        <div
                          className={`font-mono font-bold whitespace-nowrap ${
                            li.amountKes < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {li.amountKes < 0 ? `- KES ${Math.abs(li.amountKes).toLocaleString()}` : `KES ${li.amountKes.toLocaleString()}`}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Net Total */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">Total Payable</span>
                      <div className="text-[10px] text-slate-400">All fees in Kenya Shillings (KES)</div>
                    </div>
                    <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                      KES {amountKes.toLocaleString()}
                    </div>
                  </div>
                </div>

                {publicReference && (
                  <div className="text-[10px] font-mono text-slate-400 text-right">
                    Ref: {publicReference}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-all active:scale-98"
                >
                  <span>Proceed to Payment (KES {amountKes.toLocaleString()})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: PHONE INPUT & CONFIRMATION */}
        {step === 'PHONE' && (
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Enter M-Pesa Phone Number
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Safaricom will send an instant STK PIN prompt to this mobile device.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  M-Pesa Mobile Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="07XX XXX XXX or 2547XX XXX XXX"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Accepts 07XX..., 01XX..., or +254 7XX...
                </p>
              </div>

              {/* Amount badge */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/80">
                <span className="text-slate-500">Authorized Charge:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                  KES {amountKes.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('REVIEW')}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleDispatchStk}
                  disabled={isLoading || !phoneNumber.trim()}
                  className="flex-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 disabled:opacity-75 transition-all"
                >
                  {isLoading ? (
                    <span>Connecting Daraja...</span>
                  ) : (
                    <>
                      <span>Pay KES {amountKes.toLocaleString()} via M-Pesa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 & 4: LIVE STK PUSH WAITING & 5 DISTINCT PAYMENT STATES */}
        {step === 'AWAITING_STK' && (
          <div className="py-3 text-center">
            {/* 1. WAITING STATE */}
            {stkState === 'WAITING' && (
              <div className="animate-in fade-in duration-300">
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75 dark:bg-emerald-950" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                    <Phone className="h-6 w-6 animate-pulse" />
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  M-Pesa Request Dispatched
                </h4>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  A payment prompt for <strong className="text-emerald-600">KES {amountKes.toLocaleString()}</strong> has been sent to <strong className="text-slate-900 dark:text-white">{maskedPhone}</strong>.
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Waiting for PIN confirmation ({countdown}s)...</span>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-left text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-850">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer instructions:</span>
                  1. Unlock your phone.<br />
                  2. Enter your Safaricom M-Pesa PIN.<br />
                  3. A&amp;E will automatically confirm and activate your listing.
                </div>
              </div>
            )}

            {/* 2. SUCCESS STATE */}
            {stkState === 'SUCCESS' && (
              <div className="animate-in zoom-in-95 duration-200">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Confirmed!
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Your property publication entitlement has been granted.
                </p>

                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/40 text-left text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">M-Pesa Receipt:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{mpesaReceipt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">A&amp;E Invoice:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">KES {amountKes.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors"
                >
                  <span>Done &amp; View Active Listing</span>
                </button>
              </div>
            )}

            {/* 3. FAILED STATE */}
            {stkState === 'FAILED' && (
              <div className="animate-in fade-in duration-200">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                  <X className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Was Not Completed
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  No money was confirmed by A&amp;E. {failureReason}
                </p>

                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-900 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* 4. TIMEOUT STATE */}
            {stkState === 'TIMEOUT' && (
              <div className="animate-in fade-in duration-200">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <Clock className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Confirmation Timed Out
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  We couldn&apos;t confirm the payment in time. Please check your M-Pesa SMS messages before attempting another transaction.
                </p>

                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Retry Prompt
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-900 transition-colors"
                  >
                    Close &amp; Check Later
                  </button>
                </div>
              </div>
            )}

            {/* 5. UNKNOWN / DELAYED STATE */}
            {stkState === 'UNKNOWN' && (
              <div className="animate-in fade-in duration-200">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <RotateCcw className="w-8 h-8 animate-spin" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Verification In Progress
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Safaricom is processing the payment callback. <strong>Please do not pay again yet.</strong> Your listing will automatically activate once the callback arrives.
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
                >
                  <span>Acknowledge &amp; Return to Dashboard</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const AeCheckoutModal = ReksaCheckoutModal;
